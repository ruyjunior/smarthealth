'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from '@vercel/postgres';
import { fetchClientByCpf } from '@/app/domains/clients/queries';
import { fetchOfficeById } from '@/app/domains/offices/queries';
import { fetchTypeById } from '@/app/domains/types/queries';
import { isValidCpf, normalizeCpf } from '@/app/lib/cpf';
import { clinicDay } from '@/app/lib/day';
import { requireDeviceClinic } from '@/app/lib/device-session';
import { abbreviateName } from '@/app/lib/lgpd';
import { estimateWaitMinutes, formatTicketCode, resolvePriority } from '@/app/lib/queue-ticket';
import { getCurrentClinicId, requireSessionUser } from '@/app/lib/session';
import { fetchWaitingQueue } from './queries';

const TicketFields = z.object({
  cpf: z.string().min(1),
  idtype: z.string().min(1),
});

export type State = {
  message?: string;
  errors?: {
    cpf?: string[];
    idtype?: string[];
  };
  ticket?: {
    code: string;
    priority: boolean;
    position: number;
    estimatedWaitMinutes: number;
    patientName: string;
  };
};

export async function issueTicket(prevState: State, formData: FormData) {
  // O totem é público e não tem login: a clínica vem do token do dispositivo
  // pareado, nunca do formulário.
  const device = await requireDeviceClinic('totem');
  const idclinic = device.idclinic;

  const validatedFields = TicketFields.safeParse({
    cpf: formData.get('cpf'),
    idtype: formData.get('idtype'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Preencha o CPF e o serviço.',
    };
  }

  const cpf = normalizeCpf(validatedFields.data.cpf);

  if (!isValidCpf(cpf)) {
    return { message: 'CPF inválido.' };
  }

  const { idtype } = validatedFields.data;

  const service = await fetchTypeById(idclinic, idtype);

  if (!service) {
    return { message: 'Serviço indisponível.' };
  }

  // Primeiro atendimento também é aceito: o paciente fica com `idclient` nulo
  // e o CPF digitado é a única referência.
  const client = await fetchClientByCpf(idclinic, cpf);
  const day = clinicDay();
  const { priority, reason, prefix } = resolvePriority({
    birth: client?.birth,
    declared: formData.get('priority') === 'on',
  });

  let code: string;

  // Só a criação da senha está aqui: depois que ela existe, uma falha em
  // qualquer passo seguinte não pode responder "erro" a quem já tem senha.
  try {
    const counter = await sql<{ last: number }>`
      INSERT INTO smarthealth.queuecounters (idclinic, day, prefix, last)
      VALUES (${idclinic}, ${day}, ${prefix}, 1)
      ON CONFLICT (idclinic, day, prefix)
      DO UPDATE SET last = smarthealth.queuecounters.last + 1
      RETURNING last
    `;
    code = formatTicketCode(prefix, counter.rows[0].last);

    // Senha e evento de auditoria na mesma instrução: ou nascem os dois, ou nenhum.
    await sql`
      WITH ticket AS (
        INSERT INTO smarthealth.queues (
          idclinic, day, idclient, cpf, idtype, code, priority, priorityreason, status, deviceid )
        VALUES (
          ${idclinic}, ${day}, ${client?.id ?? null}, ${cpf}, ${idtype}, ${code}, ${priority},
          ${reason}, 'Aguardando', ${device.deviceId} )
        RETURNING id
      )
      INSERT INTO smarthealth.queueevents (idclinic, idqueue, status)
      SELECT ${idclinic}, ticket.id, 'Aguardando' FROM ticket
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to issue ticket.' };
  }

  // A posição é melhor-esforço: sem ela o paciente ainda recebe a senha correta.
  let peopleAhead = 0;

  try {
    const waiting = await fetchWaitingQueue(idclinic, day);
    const index = waiting.findIndex((ticket) => ticket.code === code);
    peopleAhead = index < 0 ? 0 : index;
  } catch (error) {
    console.error('Database Error: queue position', error);
  }

  revalidatePath('/totem');

  return {
    ticket: {
      code,
      priority,
      position: peopleAhead + 1,
      estimatedWaitMinutes: estimateWaitMinutes(peopleAhead),
      // A tela do totem é pública, então o nome completo nunca é devolvido.
      patientName: abbreviateName(client?.name ?? ''),
    },
  };
}

export async function callNextTicket(prevState: State, formData: FormData) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();
  const idoffice = (formData.get('idoffice') as string) || null;
  const day = clinicDay();

  // A sala vem do formulário, então precisa pertencer a esta clínica: sem isso a
  // fila passaria a exibir o nome de uma sala de outra clínica.
  if (idoffice && !(await fetchOfficeById(idclinic, idoffice))) {
    return { message: 'Sala não encontrada nesta clínica.' };
  }

  try {
    const called = await sql<{ id: string; code: string }>`
      UPDATE smarthealth.queues
      SET
        status = 'Chamada',
        calledat = now(),
        idoffice = ${idoffice},
        iduser = ${user.id}
      WHERE id = (
        SELECT id FROM smarthealth.queues
        WHERE idclinic = ${idclinic}
          AND day = ${day}
          AND status = 'Aguardando'
        ORDER BY priority DESC, createdat ASC
        LIMIT 1
      )
        AND idclinic = ${idclinic}
        -- Repetido de propósito: a subquery é avaliada uma única vez, então dois
        -- cliques simultâneos escolheriam a mesma senha sem esta condição externa.
        AND status = 'Aguardando'
      RETURNING id, code
    `;

    const ticket = called.rows[0];

    if (!ticket) {
      return { message: 'Nenhum paciente aguardando.' };
    }

    await sql`
      INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser, idoffice)
      VALUES (${idclinic}, ${ticket.id}, 'Chamada', ${user.id}, ${idoffice})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to call next ticket.' };
  }

  revalidatePath('/fila');

  return {};
}

export async function recallTicket(id: string) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();

  // A CTE amarra as duas metades da transição: o evento de auditoria só é
  // gravado quando o UPDATE realmente alcançou a senha. Um `id` de outra clínica,
  // inexistente ou já finalizado não deixa evento órfão.
  const updated = await sql<{ id: string }>`
    WITH updated AS (
      UPDATE smarthealth.queues
      -- A hora da primeira chamada é preservada: a espera é medida a partir dela
      -- e cada rechamada fica registrada em queueevents.
      SET status = 'Chamada', calledat = COALESCE(calledat, now())
      WHERE id = ${id} AND idclinic = ${idclinic}
        AND status = 'Chamada'
      RETURNING id
    )
    INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser)
    SELECT ${idclinic}, id, 'Chamada', ${user.id} FROM updated
    RETURNING idqueue AS id
  `;

  if (updated.rowCount === 0) {
    return { message: 'Esta senha não está chamada.' };
  }

  revalidatePath('/fila');

  return {};
}

export async function startTicket(id: string) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();

  const updated = await sql<{ id: string }>`
    WITH updated AS (
      UPDATE smarthealth.queues
      SET status = 'EmAtendimento', startedat = now()
      WHERE id = ${id} AND idclinic = ${idclinic}
        AND status = 'Chamada'
      RETURNING id
    )
    INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser)
    SELECT ${idclinic}, id, 'EmAtendimento', ${user.id} FROM updated
    RETURNING idqueue AS id
  `;

  if (updated.rowCount === 0) {
    return { message: 'Esta senha não está chamada.' };
  }

  revalidatePath('/fila');

  return {};
}

export async function finishTicket(id: string) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();

  const updated = await sql<{ id: string }>`
    WITH updated AS (
      UPDATE smarthealth.queues
      SET status = 'Finalizada', finishedat = now()
      WHERE id = ${id} AND idclinic = ${idclinic}
        AND status IN ('Chamada', 'EmAtendimento')
      RETURNING id
    )
    INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser)
    SELECT ${idclinic}, id, 'Finalizada', ${user.id} FROM updated
    RETURNING idqueue AS id
  `;

  if (updated.rowCount === 0) {
    return { message: 'Esta senha não está em atendimento.' };
  }

  revalidatePath('/fila');

  return {};
}

export async function markTicketAbsent(id: string) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();

  const updated = await sql<{ id: string }>`
    WITH updated AS (
      UPDATE smarthealth.queues
      SET status = 'Ausente'
      WHERE id = ${id} AND idclinic = ${idclinic}
        AND status = 'Chamada'
      RETURNING id
    )
    INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser)
    SELECT ${idclinic}, id, 'Ausente', ${user.id} FROM updated
    RETURNING idqueue AS id
  `;

  if (updated.rowCount === 0) {
    return { message: 'Esta senha não está chamada.' };
  }

  revalidatePath('/fila');

  return {};
}

export async function cancelTicket(id: string) {
  const idclinic = await getCurrentClinicId();
  const user = await requireSessionUser();

  const updated = await sql<{ id: string }>`
    WITH updated AS (
      UPDATE smarthealth.queues
      SET status = 'Cancelada'
      WHERE id = ${id} AND idclinic = ${idclinic}
        AND status IN ('Aguardando', 'Chamada')
      RETURNING id
    )
    INSERT INTO smarthealth.queueevents (idclinic, idqueue, status, iduser)
    SELECT ${idclinic}, id, 'Cancelada', ${user.id} FROM updated
    RETURNING idqueue AS id
  `;

  if (updated.rowCount === 0) {
    return { message: 'Esta senha já foi finalizada.' };
  }

  revalidatePath('/fila');

  return {};
}
