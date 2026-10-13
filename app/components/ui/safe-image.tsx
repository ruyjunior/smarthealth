'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * `next/image` que degrada para um rótulo quando o arquivo não existe.
 *
 * Arquivos em `public/` não passam pelo type-check, então um caminho errado só
 * aparecia como o ícone de imagem quebrada do navegador. Aqui o fallback assume
 * o lugar e a imagem real volta sozinha assim que o arquivo for adicionado —
 * sem precisar mexer no código.
 */
export default function SafeImage({
  fallback,
  alt,
  ...props
}: React.ComponentProps<typeof Image> & { fallback: React.ReactNode }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <>{fallback}</>;
  }

  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
