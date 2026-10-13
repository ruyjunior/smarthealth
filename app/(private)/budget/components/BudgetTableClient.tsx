'use client';
import BudgetTable from './table';
import { Type } from '@/app/domains/types/types';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';

export default function BudgetTableClient(props: { types: Type[]; user: User; clinic: Clinic }) {
  return <BudgetTable {...props} />;
}
