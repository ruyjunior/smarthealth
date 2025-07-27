import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 32,
    backgroundColor: '#f7fafc',
    color: '#22223b',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#0077b6',
    paddingBottom: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 16,
    objectFit: 'contain',
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#0077b6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 10,
    color: '#adb5bd',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#0077b6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  field: {
    fontSize: 11,
    marginBottom: 2,
    color: '#22223b',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    color: '#0077b6',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#bbb',
    paddingTop: 8,
  },
  logoApp: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  logoDev: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  footerText: {
    fontSize: 9,
    color: '#495057',
  },
  footerTextDev: {
    fontSize: 8,
    color: '#adb5bd',
    textAlign: 'right',
  },
  value: {
    fontSize: 11,
    color: '#495057',
    marginTop: 2,
    textAlign: 'right',
  },
});

export default styles;