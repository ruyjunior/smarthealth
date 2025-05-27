import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from './stylesPDF';
import { formatPhone } from '@/app/lib/utils';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Note } from '@/app/query/notes/definitions';
import { NoteType } from '@/app/query/notetypes/definitions';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { Client } from '@/app/query/clients/definitions';
import { formatDateToLocal } from '@/app/lib/utils';
import logo from '@/public/images/logo.png';

export const PagePDF = ({ note, type, user, client, clinic }: {
  note: Note, type: NoteType, user: User, client: Client, clinic: Clinic
}) => (
  <div>
    <PDFDownloadLink
      document={<DocPDF note={note} type={type} user={user} client={client} clinic={clinic} />}
      fileName={type.title + '_' + client.name + '.pdf'}
    >
      {({ loading }) => (loading ? 'Gerando PDF...' : 'Download ')}
    </PDFDownloadLink>
    <DocumentArrowDownIcon className="h-5 w-5 text-gray-500" />

    <PDFViewer style={{ width: '100%', height: '500px', marginTop: 20 }}>
      <DocPDF note={note} type={type} user={user} client={client} clinic={clinic} />
    </PDFViewer>
  </div>
);

export const DocPDF = ({ note, type, user, client, clinic }:
  { note: Note, type: NoteType, user: User, client: Client, clinic: Clinic }) => {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Image src={clinic.logourl} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{clinic.title}</Text>
            <Text style={styles.subtitle}>Endereço aqui</Text>
            <Text style={styles.reportDate}>Emitido em: {formatDateToLocal(note.date)}</Text>
          </View>
          <Image src={logo.src} style={styles.logoApp} />
        </View>

        {/* Linha divisória */}
        <View style={{ borderBottomWidth: 2, borderBottomColor: '#0077b6', marginBottom: 12 }} />

        {/* Profissional e Paciente */}
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {/* Profissional */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.sectionTitle}>Profissional</Text>
            <Text style={styles.field}><Text style={styles.label}>Nome:</Text> {user.name}</Text>
            <Text style={styles.field}><Text style={styles.label}>Registro:</Text> {user.category}</Text>
          </View>
          {/* Paciente */}
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text style={styles.sectionTitle}>Paciente</Text>
            <Text style={styles.field}><Text style={styles.label}>Nome:</Text> {client.name}</Text>
            <Text style={styles.field}><Text style={styles.label}>Telefone:</Text> {formatPhone(client.phone)}</Text>
            <Text style={styles.field}><Text style={styles.label}>Email:</Text> {client.email}</Text>
          </View>
        </View>

        {/* Linha divisória */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#bbb', marginBottom: 12 }} />

        {/* Ficha - Campos/Checks */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.chapter}>{type.title}</Text>
        </View>

        {type.fieldslabels.length > 0 && type.checkslabels.length > 0 ? (
          // Ambos existem: lado a lado
          <View style={[styles.table, { flexDirection: 'row', gap: 12 }]}>
            {/* Coluna dos Campos */}
            <View style={{ flex: 1 }}>
              <Text style={styles.tableSectionTitle}>Campos</Text>
              {type.fieldslabels.map((label, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                  <Text style={styles.tableCellHeader}>{label}</Text>
                  <Text style={styles.tableCell}>{note.fields?.[idx] ?? ''}</Text>
                </View>
              ))}
            </View>
            {/* Coluna dos Checks */}
            <View style={{ flex: 1 }}>
              <Text style={styles.tableSectionTitle}>Checks</Text>
              {type.checkslabels.map((label, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                  <Text style={styles.tableCellHeader}>{label}</Text>
                  <Text style={styles.tableCell}>
                    {note.checks?.[idx] ? 'Sim' : '-'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : type.fieldslabels.length > 0 ? (
          // Só fields
          <View style={styles.table}>
            <Text style={styles.tableSectionTitle}>Campos</Text>
            {type.fieldslabels.map((label, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                <Text style={styles.tableCellHeader}>{label}</Text>
                <Text style={styles.tableCell}>{note.fields?.[idx] ?? ''}</Text>
              </View>
            ))}
          </View>
        ) : type.checkslabels.length > 0 ? (
          // Só checks
          <View style={styles.table}>
            <Text style={styles.tableSectionTitle}>Checks</Text>
            {type.checkslabels.map((label, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                <Text style={styles.tableCellHeader}>{label}</Text>
                <Text style={styles.tableCell}>
                  {note.checks?.[idx] ? 'Sim' : '-'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          // Nenhum campo/check
          <Text style={styles.tableCell}>Nenhum campo preenchido.</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}
          fixed
        >
          {/* Esquerda */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src={logo.src} style={styles.logoApp} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.footerText}>Smart Health - Sua Clínica Online</Text>
              <Text style={styles.footerText}>www.smarthealt.app.br</Text>
            </View>
          </View>
          {/* Direita */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 12, textAlign: 'right' }}>
              <Text style={styles.footerTextDev}>Desenvolvido por Autoric Automation</Text>
              <Text style={styles.footerTextDev}>www.autoric.com.br</Text>
            </View>
            <Image src="https://www.autoric.com.br/images/logo.png" style={styles.logoDev} />
          </View>
        </View>
      </Page>
    </Document>
  );
};