import PairingScreen from '../components/pairing-screen';

// Depende do cookie do dispositivo, então não pode ser pré-renderizada.
export const dynamic = 'force-dynamic';

/** Endereço canônico do pareamento: curto o bastante para digitar numa TV. */
export default function Page() {
  return <PairingScreen />;
}
