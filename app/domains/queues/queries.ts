import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import {
  PANEL_NEXT_LIMIT,
  type PanelCall,
  type QueueTicket,
  type QueueTicketWithDetails,
} from './types';

export async function fetchWaitingQueue(idclinic: string, day: string) {
  try {
    const data = await sql<QueueTicket>`
      SELECT
        id, idclinic, to_char(day, 'YYYY-MM-DD') AS day, idclient, cpf, idtype, idoffice,
        iduser, code, priority,
        priorityreason, status, deviceid, createdat, calledat, startedat, finishedat
      FROM smarthealth.queues
      WHERE queues.idclinic = ${idclinic}
        AND queues.day = ${day}
        AND queues.status = 'Aguardando'
      ORDER BY priority DESC, createdat ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch waiting queue.');
  }
}

export async function fetchQueueByDay(idclinic: string, day: string) {
  try {
    const data = await sql<QueueTicketWithDetails>`
      SELECT
        queues.id, queues.idclinic, to_char(queues.day, 'YYYY-MM-DD') AS day, queues.idclient,
        queues.cpf, queues.idtype,
        queues.idoffice, queues.iduser, queues.code, queues.priority, queues.priorityreason,
        queues.status, queues.deviceid, queues.createdat, queues.calledat, queues.startedat,
        queues.finishedat,
        CASE WHEN queues.idclient IS NULL THEN NULL
          ELSE json_build_object('name', clients.name, 'pronoun', clients.pronoun) END AS client,
        CASE WHEN types.id IS NULL THEN NULL
          ELSE json_build_object('title', types.title) END AS type,
        CASE WHEN queues.idoffice IS NULL THEN NULL
          ELSE json_build_object('title', offices.title) END AS office,
        CASE WHEN queues.iduser IS NULL THEN NULL
          ELSE json_build_object('name', users.name, 'pronoun', users.pronoun) END AS user
      FROM smarthealth.queues
      LEFT JOIN smarthealth.clients ON queues.idclient = clients.id
        AND clients.idclinic = queues.idclinic
      LEFT JOIN smarthealth.types ON queues.idtype = types.id
        AND types.idclinic = queues.idclinic
      LEFT JOIN smarthealth.offices ON queues.idoffice = offices.id
        AND offices.idclinic = queues.idclinic
      LEFT JOIN smarthealth.users ON queues.iduser = users.id
        AND users.idclinic = queues.idclinic
      WHERE queues.idclinic = ${idclinic} AND queues.day = ${day}
      ORDER BY priority DESC, createdat ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch queue by day.');
  }
}

/**
 * Consulta própria do telão: devolve só o que uma tela pública pode mostrar.
 *
 * Não reaproveita `fetchQueueByDay` de propósito — aquela versão traz o CPF e o
 * nome completo de todos, e a TV fica numa parede, visível para a sala inteira.
 * Aqui o CPF nunca é selecionado.
 */
export async function fetchPanelCalls(idclinic: string, day: string) {
  try {
    const data = await sql<PanelCall>`
      WITH panel AS (
        SELECT
          queues.id, queues.code, queues.status, queues.priority, queues.priorityreason,
          queues.calledat, queues.startedat,
          clients.name AS patientname, clients.pronoun AS patientpronoun,
          offices.title AS officetitle,
          users.name AS doctorname,
          -- A coluna calledat guarda a PRIMEIRA chamada (é a base do tempo de espera),
          -- então a última vem da trilha de eventos: é isso que faz a rechamada
          -- reanunciar no telão.
          (
            SELECT MAX(events.at)
            FROM smarthealth.queueevents AS events
            WHERE events.idqueue = queues.id AND events.status = 'Chamada'
          ) AS lastcallat
        FROM smarthealth.queues
        LEFT JOIN smarthealth.clients ON queues.idclient = clients.id
          AND clients.idclinic = queues.idclinic
        LEFT JOIN smarthealth.offices ON queues.idoffice = offices.id
          AND offices.idclinic = queues.idclinic
        LEFT JOIN smarthealth.users ON queues.iduser = users.id
          AND users.idclinic = queues.idclinic
        WHERE queues.idclinic = ${idclinic}
          AND queues.day = ${day}
          AND queues.status IN ('Chamada', 'EmAtendimento')
      )
      SELECT * FROM panel
      ORDER BY COALESCE(panel.lastcallat, panel.calledat) DESC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch panel calls.');
  }
}

/** Próximas senhas: só código e preferência — nome de quem ainda não foi chamado não vai ao telão. */
export async function fetchPanelNext(idclinic: string, day: string) {
  try {
    const data = await sql<{ code: string; priority: boolean }>`
      SELECT code, priority
      FROM smarthealth.queues
      WHERE queues.idclinic = ${idclinic}
        AND queues.day = ${day}
        AND queues.status = 'Aguardando'
      ORDER BY priority DESC, createdat ASC
      LIMIT ${PANEL_NEXT_LIMIT}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch next tickets.');
  }
}

export async function fetchQueueItemById(idclinic: string, id: string) {
  try {
    const data = await sql<QueueTicketWithDetails>`
      SELECT
        queues.id, queues.idclinic, to_char(queues.day, 'YYYY-MM-DD') AS day, queues.idclient,
        queues.cpf, queues.idtype,
        queues.idoffice, queues.iduser, queues.code, queues.priority, queues.priorityreason,
        queues.status, queues.deviceid, queues.createdat, queues.calledat, queues.startedat,
        queues.finishedat,
        CASE WHEN queues.idclient IS NULL THEN NULL
          ELSE json_build_object('name', clients.name, 'pronoun', clients.pronoun) END AS client,
        CASE WHEN types.id IS NULL THEN NULL
          ELSE json_build_object('title', types.title) END AS type,
        CASE WHEN queues.idoffice IS NULL THEN NULL
          ELSE json_build_object('title', offices.title) END AS office,
        CASE WHEN queues.iduser IS NULL THEN NULL
          ELSE json_build_object('name', users.name, 'pronoun', users.pronoun) END AS user
      FROM smarthealth.queues
      LEFT JOIN smarthealth.clients ON queues.idclient = clients.id
        AND clients.idclinic = queues.idclinic
      LEFT JOIN smarthealth.types ON queues.idtype = types.id
        AND types.idclinic = queues.idclinic
      LEFT JOIN smarthealth.offices ON queues.idoffice = offices.id
        AND offices.idclinic = queues.idclinic
      LEFT JOIN smarthealth.users ON queues.iduser = users.id
        AND users.idclinic = queues.idclinic
      WHERE queues.id = ${id} AND queues.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch queue item.');
  }
}

export async function fetchFilteredQueue(
  idclinic: string,
  query: string | undefined | null,
  currentPnumber: number | undefined | null,
) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;
  try {
    const data = await sql<QueueTicketWithDetails>`
      SELECT
        queues.id, queues.idclinic, to_char(queues.day, 'YYYY-MM-DD') AS day, queues.idclient,
        queues.cpf, queues.idtype,
        queues.idoffice, queues.iduser, queues.code, queues.priority, queues.priorityreason,
        queues.status, queues.deviceid, queues.createdat, queues.calledat, queues.startedat,
        queues.finishedat,
        CASE WHEN queues.idclient IS NULL THEN NULL
          ELSE json_build_object('name', clients.name, 'pronoun', clients.pronoun) END AS client,
        CASE WHEN types.id IS NULL THEN NULL
          ELSE json_build_object('title', types.title) END AS type,
        CASE WHEN queues.idoffice IS NULL THEN NULL
          ELSE json_build_object('title', offices.title) END AS office,
        CASE WHEN queues.iduser IS NULL THEN NULL
          ELSE json_build_object('name', users.name, 'pronoun', users.pronoun) END AS user
      FROM smarthealth.queues
      LEFT JOIN smarthealth.clients ON queues.idclient = clients.id
        AND clients.idclinic = queues.idclinic
      LEFT JOIN smarthealth.types ON queues.idtype = types.id
        AND types.idclinic = queues.idclinic
      LEFT JOIN smarthealth.offices ON queues.idoffice = offices.id
        AND offices.idclinic = queues.idclinic
      LEFT JOIN smarthealth.users ON queues.iduser = users.id
        AND users.idclinic = queues.idclinic
      WHERE
        (queues.code ILIKE ${`%${query ?? ''}%`} OR
        queues.cpf::text ILIKE ${`%${query ?? ''}%`} OR
        clients.name::text ILIKE ${`%${query ?? ''}%`})
        AND queues.idclinic = ${idclinic}
      ORDER BY queues.createdat DESC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search queue.');
  }
}

export async function fetchQueuePages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.queues
      LEFT JOIN smarthealth.clients ON queues.idclient = clients.id
        AND clients.idclinic = queues.idclinic
      WHERE
        (queues.code ILIKE ${`%${query}%`} OR
        queues.cpf::text ILIKE ${`%${query}%`} OR
        clients.name::text ILIKE ${`%${query}%`})
        AND queues.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}
