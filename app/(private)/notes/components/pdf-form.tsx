'use client';
import { PagePDF } from './docPDF';
import { Note } from '@/app/query/notes/definitions';
import { NoteType } from '@/app/query/notetypes/definitions';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { Client } from '@/app/query/clients/definitions';

export default function PdfForm({ note, type, user, client, clinic}: {
  note: Note;
  type: NoteType;
  user: User;
  client: Client;
  clinic: Clinic;
}) {

  return (<PagePDF note={note} type={type} user={user} client={client} clinic={clinic} />);
}