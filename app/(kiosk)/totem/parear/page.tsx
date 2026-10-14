import PairingScreen from '../../components/pairing-screen';

// Depende do cookie do dispositivo, então não pode ser pré-renderizada.
export const dynamic = 'force-dynamic';

/**
 * Alias de `/tv`, mantido para não quebrar links e atalhos já usados no quiosque.
 * A tela é a mesma; `/tv` é o endereço canônico.
 */
export default function Page() {
  return <PairingScreen />;
}
