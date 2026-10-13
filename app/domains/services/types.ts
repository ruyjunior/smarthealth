/** Single source of truth for the values stored in `services.status`. */
export const SERVICE_STATUSES = ['Vazia', 'Marcada', 'Feito'] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export type Service = {
  id: string;
  iduser: string;
  idoffice: string;
  idclient: string;
  idtype: string;
  status: ServiceStatus;
  date: string;
  starttime: string;
  endtime: string;
  idclinic: string;
};

export interface ServiceWithDetails {
  id: string;
  date: string;
  starttime: string;
  endtime: string;
  status: ServiceStatus;
  client: { name: string; pronoun: string };
  office: { title: string };
  type: { title: string };
  user: { name: string; pronoun?: string };
}
