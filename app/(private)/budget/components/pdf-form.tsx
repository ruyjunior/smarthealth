'use client';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';
import { BudgetItem } from './table';
import { PDFViewer } from '@react-pdf/renderer';
import { ButtonPDF } from './buttonPDF';
import { DocPDF } from './docPDF';

export default function PdfForm({
  list,
  clinic,
  user,
}: {
  list: BudgetItem[];
  clinic: Clinic;
  user: User;
}) {
  return (
    <div className="w-full p-4">
      <ButtonPDF list={list} clinic={clinic} user={user} />

      <PDFViewer style={{ width: '100%', height: '500px', marginTop: 20 }}>
        <DocPDF list={list} clinic={clinic} user={user} />
      </PDFViewer>
    </div>
  );
}
