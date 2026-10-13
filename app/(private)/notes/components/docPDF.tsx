import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from '@/app/components/ui/pdf-styles';
import { formatPhone, formatDateToLocal } from '@/app/lib/utils';
import { Note } from '@/app/domains/notes/types';
import { NoteType } from '@/app/domains/notetypes/types';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';
import { Client } from '@/app/domains/clients/types';
import logo from '@/public/images/logo.png';
import logoDev from '@/public/images/logos/logoDev.png';

type DocProps = {
  note: Note;
  type: NoteType;
  user: User;
  client: Client;
  clinic: Clinic;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerBlock}>
        <Image src={logo.src} style={styles.footerLogo} />
        <View>
          <Text style={styles.footerText}>Smart Health - Sua Clinica Online</Text>
          <Text style={styles.footerTextFaint}>www.smarthealth.app.br</Text>
        </View>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`}
      />

      <View style={[styles.footerBlock, { justifyContent: 'flex-end' }]}>
        <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
          <Text style={styles.footerTextFaint}>Desenvolvido por Autoric Automation</Text>
          <Text style={styles.footerTextFaint}>www.autoric.com.br</Text>
        </View>
        <Image src={logoDev.src} style={styles.footerLogoDev} />
      </View>
    </View>
  );
}

function FieldTable({
  labels,
  values,
  renderValue,
}: {
  labels: string[];
  values: (string | boolean | undefined)[];
  renderValue?: (value: string | boolean | undefined) => string;
}) {
  if (labels.length === 0) return null;

  return (
    <View style={styles.table}>
      {labels.map((label, idx) => {
        const raw = values[idx];
        const text = renderValue ? renderValue(raw) : String(raw ?? '');

        return (
          <View
            key={`${label}-${idx}`}
            style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <Text style={styles.colLabel}>{label}</Text>
            <Text style={styles.colValue}>{text}</Text>
          </View>
        );
      })}
    </View>
  );
}

export const DocPDF = ({ note, type, user, client, clinic }: DocProps) => {
  const fieldLabels = type.fieldslabels ?? [];
  const checkLabels = type.checkslabels ?? [];
  const hasFields = fieldLabels.length > 0;
  const hasChecks = checkLabels.length > 0;

  return (
    <Document title={`${type.title} - ${client.name}`} author={clinic.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image src={clinic.logourl} style={styles.logo} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.docTitle}>FICHA CLINICA</Text>
            <Text style={styles.clinicName}>{clinic.title}</Text>
            {clinic.siteurl ? <Text style={styles.clinicLine}>{clinic.siteurl}</Text> : null}
            {clinic.address ? <Text style={styles.clinicLine}>{clinic.address}</Text> : null}
            {clinic.phone ? <Text style={styles.clinicLine}>Telefone: {clinic.phone}</Text> : null}
            {clinic.cnpj ? <Text style={styles.clinicLine}>CNPJ: {clinic.cnpj}</Text> : null}
          </View>

          <View style={styles.headerMeta}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Emitido em</Text>
              <Text style={styles.metaValue}>{formatDateToLocal(note.date)}</Text>
            </View>
          </View>
        </View>

        {/* Paciente */}
        <View style={styles.sectionCard}>
          <SectionTitle>Paciente</SectionTitle>
          <Text style={styles.field}>
            <Text style={styles.label}>Nome: </Text>
            {client.pronoun} {client.name}
          </Text>
          {client.phone ? (
            <Text style={styles.field}>
              <Text style={styles.label}>Telefone: </Text>
              {formatPhone(client.phone)}
            </Text>
          ) : null}
          {client.email ? (
            <Text style={styles.field}>
              <Text style={styles.label}>Email: </Text>
              {client.email}
            </Text>
          ) : null}
        </View>

        {/* Ficha */}
        <View style={styles.sectionCard}>
          <SectionTitle>{type.title}</SectionTitle>

          {!hasFields && !hasChecks ? (
            <Text style={styles.emptyText}>Nenhum campo preenchido nesta ficha.</Text>
          ) : (
            <>
              {hasFields && (
                <View style={hasChecks ? { marginBottom: 12 } : {}}>
                  {hasChecks ? (
                    <Text style={[styles.label, { marginBottom: 5 }]}>Campos</Text>
                  ) : null}
                  <FieldTable labels={fieldLabels} values={note.fields ?? []} />
                </View>
              )}

              {hasChecks && (
                <View>
                  {hasFields ? (
                    <Text style={[styles.label, { marginBottom: 5 }]}>Caixas de selecao</Text>
                  ) : null}
                  <FieldTable
                    labels={checkLabels}
                    values={note.checks ?? []}
                    renderValue={(value) => (value ? 'Sim' : 'Nao')}
                  />
                </View>
              )}
            </>
          )}
        </View>

        {/* Profissional */}
        <View style={styles.sectionCard}>
          <SectionTitle>Profissional responsavel</SectionTitle>
          <Text style={styles.field}>
            <Text style={styles.label}>Nome: </Text>
            {user.pronoun} {user.name}
          </Text>
          {user.category ? (
            <Text style={styles.field}>
              <Text style={styles.label}>Registro: </Text>
              {user.category}
            </Text>
          ) : null}
          <View style={styles.signatureLine}>
            <Text style={[styles.emptyText, { fontSize: 8 }]}>Assinatura</Text>
          </View>
        </View>

        <PdfFooter />
      </Page>
    </Document>
  );
};
