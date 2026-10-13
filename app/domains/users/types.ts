import type { UserRole } from '@/app/lib/roles';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: string;
  payment_itent: string;
  amount_paid: number;
  idclinic: string;
  avatarurl: string;
  category: string;
  pronoun: string;
};
