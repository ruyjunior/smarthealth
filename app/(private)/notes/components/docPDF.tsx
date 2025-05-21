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
            <Text style={styles.subtitle}>Ficha</Text>
            <Text style={styles.title}>{type.title}</Text>
            <Text style={styles.reportDate}>Data de criação: {formatDateToLocal(note.date)}</Text>
          </View>
        </View>

        {/* Clínica */}
        <View style={styles.section}>
          <Text style={styles.chapter}>{clinic.title}</Text>
          <Text style={styles.field}><Text style={styles.label}>Dr.(a):</Text> {user.name}</Text>
          <Text style={styles.field}><Text style={styles.label}>Registro:</Text> {user.category}</Text>
        </View>

        {/* Paciente */}
        <View style={styles.section}>
          <Text style={styles.chapter}>Paciente</Text>
          <Text style={styles.field}><Text style={styles.label}>Nome:</Text> {client.name}</Text>
          <Text style={styles.field}><Text style={styles.label}>Telefone:</Text> {formatPhone(client.phone)}</Text>
          <Text style={styles.field}><Text style={styles.label}>Email:</Text> {client.email}</Text>
        </View>

        {/* Ficha - Campos/Checks */}
        <View style={styles.section}>
          <Text style={styles.chapter}>{type.title}</Text>
        </View>

        {type.fieldslabels.length > 0 && type.checkslabels.length > 0 ? (
          // Ambos existem: lado a lado
          <View style={[styles.table, { flexDirection: 'row' }]}>
            {/* Coluna dos Campos */}
            <View style={{ flex: 1 }}>
              {type.fieldslabels.map((label, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                  <Text style={styles.tableCellHeader}>{label}</Text>
                  <Text style={styles.tableCell}>{note.fields?.[idx] ?? ''}</Text>
                </View>
              ))}
            </View>
            {/* Coluna dos Checks */}
            <View style={{ flex: 1 }}>
              {type.checkslabels.map((label, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                  <Text style={styles.tableCellHeader}>{label}</Text>
                  <Text style={styles.tableCell}>{note.checks?.[idx] ? 'Sim' : 'Não'}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : type.fieldslabels.length > 0 ? (
          // Só fields
          <View style={styles.table}>
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
            {type.checkslabels.map((label, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowAlt : {}]}>
                <Text style={styles.tableCellHeader}>{label}</Text>
                <Text style={styles.tableCell}>{note.checks?.[idx] ? 'Sim' : 'Não'}</Text>
              </View>
            ))}
          </View>
        ) : (
          // Nenhum campo/check
          <Text style={styles.tableCell}>Nenhum campo preenchido.</Text>
        )}
        <View
          style={[
            styles.footer,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: 10,
              left: 30,
              right: 30,
              paddingTop: 8,
              paddingBottom: 8,
              borderTopWidth: 1,
              borderTopColor: '#bbb',
            },
          ]}
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
    </Document >
  );
};