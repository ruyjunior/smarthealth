'use client';
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';
import { Note } from '@/app/domains/notes/types';
import { NoteType } from '@/app/domains/notetypes/types';
import { Client } from '@/app/domains/clients/types';
import { DocPDF } from './docPDF';

export const ButtonPDF = ({
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
}) => (
  <PDFDownloadLink
    document={<DocPDF note={note} type={type} user={user} client={client} clinic={clinic} />}
    fileName={type.title + '_' + client.name + '.pdf'}
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-sm"
  >
    {({ loading }) => (
      <>
        <DocumentArrowDownIcon className="h-5 w-5" />
        {loading ? 'Gerando PDF...' : 'Baixar ' + type.title}
      </>
    )}
  </PDFDownloadLink>
);
