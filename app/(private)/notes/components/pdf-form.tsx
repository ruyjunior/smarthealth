'use client';
import { Note } from '@/app/domains/notes/types';
import { NoteType } from '@/app/domains/notetypes/types';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';
import { Client } from '@/app/domains/clients/types';
import { PDFViewer } from '@react-pdf/renderer';
import { ButtonPDF } from './buttonPDF';
import { DocPDF } from './docPDF';

export default function PdfForm({
  note,
  type,
  user,
  client,
  clinic,
}: {
  note: Note;
  type: NoteType;
  user: User;
  client: Client;
  clinic: Clinic;
}) {
  return (
    <div className="w-full p-4">
      <ButtonPDF note={note} type={type} user={user} client={client} clinic={clinic} />
      <PDFViewer style={{ width: '100%', height: '500px', marginTop: 20 }}>
        <DocPDF note={note} type={type} user={user} client={client} clinic={clinic} />
      </PDFViewer>
    </div>
  );
}
