/** Single source of truth for the values stored in `queues.status`. */
export const QUEUE_STATUSES = [
  'Aguardando',
  'Chamada',
  'EmAtendimento',
  'Finalizada',
  'Ausente',
  'Cancelada',
] as const;

export type QueueStatus = (typeof QUEUE_STATUSES)[number];

export type QueueTicket = {
  id: string;
  idclinic: string;
  day: string;
  idclient: string | null;
  cpf: string;
  idtype: string;
  idoffice: string | null;
  iduser: string | null;
  code: string;
  priority: boolean;
  priorityreason: string | null;
  status: QueueStatus;
  deviceid: string | null;
  /** O driver devolve timestamptz como `Date`; `day` volta como texto pelo to_char. */
  createdat: Date;
  calledat: Date | null;
  startedat: Date | null;
  finishedat: Date | null;
};

export interface QueueTicketWithDetails extends QueueTicket {
  client: { name: string; pronoun: string | null } | null;
  /** Nulo quando o serviço escolhido foi apagado depois da emissão da senha. */
  type: { title: string } | null;
  office: { title: string } | null;
  user: { name: string; pronoun: string | null } | null;
}

/** Quantas senhas futuras o telão anuncia. */
export const PANEL_NEXT_LIMIT = 5;

/** Linha do telão: nada de CPF e nada de `idclient` — é uma tela pública. */
export type PanelCall = {
  id: string;
  code: string;
  status: 'Chamada' | 'EmAtendimento';
  priority: boolean;
  priorityreason: string | null;
  calledat: Date | null;
  /** Última chamada, lida da trilha de eventos: muda quando a recepção rechama. */
  lastcallat: Date | null;
  startedat: Date | null;
  patientname: string | null;
  patientpronoun: string | null;
  officetitle: string | null;
  doctorname: string | null;
};
