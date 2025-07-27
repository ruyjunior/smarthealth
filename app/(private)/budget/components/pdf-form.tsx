'use client';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { BudgetItem } from './table';
import { PDFViewer } from '@react-pdf/renderer';
import { ButtonPDF } from './buttonPDF';
import { DocPDF } from './docPDF';
import ReactPDF from '@react-pdf/renderer';

export default function PdfForm({ list, clinic, user }: { list: BudgetItem[], clinic: Clinic, user: User }) {
  return (
    <div className='w-full p-4'>
      
      <ButtonPDF list={list} clinic={clinic} user={user} />
       
      <PDFViewer style={{ width: '100%', height: '500px', marginTop: 20 }}>
        <DocPDF list={list} clinic={clinic} user={user} />
      </PDFViewer>
      
    </div>
  );
}