'use client';
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { BudgetItem } from './table';
import { DocPDF } from './docPDF';

export const ButtonPDF = ({
  list, clinic, user
}: {
  list: BudgetItem[], clinic: Clinic, user: User
}) => (
  <PDFDownloadLink
    document={<DocPDF list={list} clinic={clinic} user={user} />}
    fileName={'Orcamento_' + clinic.title + '.pdf'}
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-sm"
  >
    {({ loading }) => (
      <>
        <DocumentArrowDownIcon className="h-5 w-5" />
        {loading ? 'Gerando PDF...' : 'Baixar orçamento'}
      </>
    )}
  </PDFDownloadLink>
);