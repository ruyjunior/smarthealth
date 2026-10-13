import { StyleSheet } from '@react-pdf/renderer';

/** Shared palette so every generated PDF matches the app's visual identity. */
const colors = {
  brand: '#1d4ed8',
  brandDark: '#1e3a8a',
  brandSoft: '#eff6ff',
  brandLine: '#bfdbfe',
  text: '#0f172a',
  muted: '#475569',
  faint: '#94a3b8',
  line: '#e2e8f0',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  success: '#047857',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.surface,
    paddingTop: 30,
    paddingBottom: 84,
    paddingHorizontal: 34,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: colors.brand,
  },

  /* ---------- Header ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginBottom: 16,
  },
  logoBox: {
    width: 78,
    height: 78,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceAlt,
    padding: 6,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  headerInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.brandDark,
    letterSpacing: 0.6,
  },
  clinicName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  clinicLine: {
    fontSize: 8.5,
    color: colors.muted,
    marginTop: 1.5,
  },
  headerMeta: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  metaBox: {
    borderWidth: 1,
    borderColor: colors.brandLine,
    backgroundColor: colors.brandSoft,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 7,
    color: colors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.brandDark,
    marginTop: 2,
  },

  /* ---------- Sections ---------- */
  sectionCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionAccent: {
    width: 3,
    height: 12,
    backgroundColor: colors.brand,
    marginRight: 7,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.brandDark,
  },
  field: {
    fontSize: 9.5,
    color: colors.text,
    marginBottom: 3,
    lineHeight: 1.35,
  },
  label: {
    fontWeight: 'bold',
    color: colors.muted,
  },
  twoColumns: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  columnSpacing: {
    marginLeft: 12,
  },

  /* ---------- Tables ---------- */
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeadRow: {
    flexDirection: 'row',
    backgroundColor: colors.brand,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeadCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.surface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tableRowAlt: {
    backgroundColor: colors.surfaceAlt,
  },
  tableCell: {
    fontSize: 9,
    color: colors.text,
  },
  tableCellStrong: {
    fontSize: 9,
    color: colors.text,
    fontWeight: 'bold',
  },
  tableNote: {
    fontSize: 8,
    color: colors.faint,
    marginTop: 2,
  },

  /* Column widths */
  colWide: { flex: 2.2 },
  colNarrow: { flex: 1, textAlign: 'center' },
  colLabel: { flex: 1.4, fontWeight: 'bold', color: colors.muted },
  colValue: { flex: 2.6 },

  /* ---------- Totals ---------- */
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsBox: {
    minWidth: 190,
    borderWidth: 1,
    borderColor: colors.brandLine,
    backgroundColor: colors.brandSoft,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalsValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.brandDark,
  },

  /* ---------- Footer ---------- */
  footer: {
    position: 'absolute',
    bottom: 26,
    left: 34,
    right: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
  },
  footerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLogo: {
    width: 26,
    height: 26,
    objectFit: 'contain',
    marginRight: 8,
  },
  /** Wide wordmark (1160x323) keeps its ratio in the footer. */
  footerLogoDev: {
    width: 58,
    height: 16,
    objectFit: 'contain',
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
  footerTextFaint: {
    fontSize: 7.5,
    color: colors.faint,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.faint,
  },

  /* ---------- Misc ---------- */
  emptyText: {
    fontSize: 9.5,
    color: colors.faint,
    fontStyle: 'italic',
  },
  signatureLine: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
    width: '60%',
  },
});

export default styles;
