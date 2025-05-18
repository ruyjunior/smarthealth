export type Service = {
  id: string;
  iduser: string;
  idoffice: string;
  idclient: string;
  idtype: string;
  status: string;
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
  status: string;
  client: { name: string };
  office: { title: string };
  type: { title: string };
  user: { name: string };
}
