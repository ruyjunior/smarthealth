'use client';
import { PagePDF } from './docPDF';
import { Note } from '@/app/query/notes/definitions';
import { NoteType } from '@/app/query/notetypes/definitions';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { Client } from '@/app/query/clients/definitions';
import { PDFViewer } from '@react-pdf/renderer';
import { ButtonPDF } from './buttonPDF';
import { DocPDF } from './docPDF';


export default function PdfForm({ note, type, user, client, clinic }: {
  note: Note;
  type: NoteType;
  user: User;
  client: Client;
  clinic: Clinic;
}) {

  return (
    <div className='w-full p-4'>
      <ButtonPDF note={note} type={type} user={user} client={client} clinic={clinic} />
      <PDFViewer style={{ width: '100%', height: '500px', marginTop: 20 }}>
        <DocPDF note={note} type={type} user={user} client={client} clinic={clinic} />
      </PDFViewer>
    </div> 
  );
}