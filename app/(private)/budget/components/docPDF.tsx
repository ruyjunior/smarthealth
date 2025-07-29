'use client';
import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from './stylesPDF';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { formatCurrency } from '@/app/lib/utils';
import logo from '@/public/images/logo.png';
import { BudgetItem } from './table';

export const DocPDF = ({ list, clinic, user }: {
  list: BudgetItem[], clinic: Clinic, user: User
}) => {

  const reportDate = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Image src={clinic.logourl} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>ORÇAMENTO</Text>
            <Text style={styles.reportDate}>Emitido em: {reportDate}</Text>

            <Text style={styles.subtitle}>{clinic.title}</Text>
            <Text style={styles.subtitle}>{clinic?.siteurl}</Text>
            <Text style={styles.subtitle}>{clinic?.address}</Text>
            <Text style={styles.subtitle}>Telefone: {clinic?.phone}</Text>
            <Text style={styles.subtitle}>CNPJ: {clinic?.cnpj}</Text>
          </View>
        </View>

        {/* Linha divisória */}
        <View style={{ borderBottomWidth: 2, borderBottomColor: '#0077b6', marginBottom: 12 }} />

        {/* Total */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Lista</Text>
          <Text style={styles.sectionTitle}>Total</Text>
          <Text style={styles.field}>{formatCurrency(list.reduce((acc, item) => acc + item.total, 0))}</Text>
        </View>

        {/* Lista de Orçamento */}
        <View style={{ marginBottom: 12 }}>
          {/* Cabeçalho */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#e0f2fe',
            borderRadius: 4,
            paddingVertical: 4,
            marginBottom: 4,
          }}>
            <Text style={[styles.field, { flex: 2, fontWeight: 'bold' }]}>Procedimento</Text>
            <Text style={[styles.field, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>Qtd</Text>
            <Text style={[styles.field, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>Valor unit.</Text>
            <Text style={[styles.field, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>Total item</Text>
          </View>
          {/* Itens */}
          {list.map((item, index) => (
            <View key={index} style={{
              flexDirection: 'column',
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              marginBottom: 4,
              paddingBottom: 4,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.field, { flex: 2 }]}>{item.type.title}</Text>
                <Text style={[styles.field, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.field, { flex: 1, textAlign: 'center' }]}>{formatCurrency(item.type.price)}</Text>
                <Text style={[styles.field, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>{formatCurrency(item.total)}</Text>
              </View>
              {item.type.description && (
                <Text style={[styles.field, { color: '#666', fontSize: 9, marginLeft: 2 }]}>
                  {item.type.description}
                </Text>
              )}
            </View>
          ))}

          {/* Linha divisória */}
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#bbb', marginBottom: 20 }} />

          {/* Profissional */}
          <View style={{ flexDirection: 'row', marginBottom: 12, marginTop: 12, alignContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.sectionTitle}>Profissional</Text>
              <Text style={styles.field}><Text style={styles.label}></Text>{user.pronoun} {user.name}</Text>
              <Text style={styles.field}><Text style={styles.label}>Registro:</Text> {user.category}</Text>
            </View>
          </View>

        </View>
        {/* Footer */}
        <View style={styles.footer}
          fixed
        >
          {/* Esquerda */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src={logo.src} style={styles.logoApp} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.footerText}>Smart Health - Sua Clínica Online</Text>
              <Text style={styles.footerText}>www.smarthealth.app.br</Text>
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