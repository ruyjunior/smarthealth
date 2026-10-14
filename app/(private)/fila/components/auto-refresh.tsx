'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Renova a tela de tempos em tempos: uma senha emitida no totem precisa aparecer
 * aqui sem a recepção ter de recarregar a página na mão.
 */
export default function AutoRefresh({ seconds = 15 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(timer);
  }, [router, seconds]);

  return null;
}
