'use client';
import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from '@/app/components/ui/pdf-styles';
import { User } from '@/app/domains/users/types';
import { Clinic } from '@/app/domains/clinics/types';
import { formatCurrency } from '@/app/lib/utils';
import logo from '@/public/images/logo.png';
import logoDev from '@/public/images/logos/logoDev.png';
import { BudgetItem } from './table';

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

export const DocPDF = ({
  list,
  clinic,
  user,
}: {
  list: BudgetItem[];
  clinic: Clinic;
  user: User;
}) => {
  const reportDate = new Date().toLocaleDateString('pt-BR');
  const total = list.reduce((acc, item) => acc + item.total, 0);

  return (
    <Document title={`Orcamento - ${clinic.title}`} author={clinic.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image src={clinic.logourl} style={styles.logo} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.docTitle}>ORCAMENTO</Text>
            <Text style={styles.clinicName}>{clinic.title}</Text>
            {clinic.siteurl ? <Text style={styles.clinicLine}>{clinic.siteurl}</Text> : null}
            {clinic.address ? <Text style={styles.clinicLine}>{clinic.address}</Text> : null}
            {clinic.phone ? <Text style={styles.clinicLine}>Telefone: {clinic.phone}</Text> : null}
            {clinic.cnpj ? <Text style={styles.clinicLine}>CNPJ: {clinic.cnpj}</Text> : null}
          </View>

          <View style={styles.headerMeta}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Emitido em</Text>
              <Text style={styles.metaValue}>{reportDate}</Text>
            </View>
          </View>
        </View>

        {/* Itens */}
        <View style={styles.sectionCard}>
          <SectionTitle>Procedimentos</SectionTitle>

          {list.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum item adicionado ao orcamento.</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeadRow}>
                <Text style={[styles.tableHeadCell, styles.colWide]}>Procedimento</Text>
                <Text style={[styles.tableHeadCell, styles.colNarrow]}>Qtd</Text>
                <Text style={[styles.tableHeadCell, styles.colNarrow]}>Valor unit.</Text>
                <Text style={[styles.tableHeadCell, styles.colNarrow]}>Total</Text>
              </View>

              {list.map((item, index) => (
                <View
                  key={`${item.type.id}-${index}`}
                  style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                >
                  <View style={styles.colWide}>
                    <Text style={styles.tableCellStrong}>{item.type.title}</Text>
                    {item.type.description ? (
                      <Text style={styles.tableNote}>{item.type.description}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.tableCell, styles.colNarrow]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.colNarrow]}>
                    {formatCurrency(Number(item.type.price))}
                  </Text>
                  <Text style={[styles.tableCellStrong, styles.colNarrow]}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.totalsRow}>
            <View style={styles.totalsBox}>
              <Text style={styles.totalsLabel}>Total geral</Text>
              <Text style={styles.totalsValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
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
