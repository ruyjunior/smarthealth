'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { FaWhatsapp } from 'react-icons/fa';

const baseIconAction =
  'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200';

const tones = {
  edit: 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100',
  view: 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100',
  delete: 'border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100',
  whatsapp:
    'border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100',
  print:
    'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100',
} as const;

/** Primary call-to-action used in page headers. */
export function CreateAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.01] hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span>{label}</span>
      <PlusIcon className="h-5 w-5" />
    </Link>
  );
}

export function EditAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${baseIconAction} ${tones.edit}`}
      aria-label={label}
      title={label}
    >
      <PencilIcon className="h-4 w-4" />
    </Link>
  );
}

export function ViewAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${baseIconAction} ${tones.view}`}
      aria-label={label}
      title={label}
    >
      <EyeIcon className="h-4 w-4" />
    </Link>
  );
}

export function PrintAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${baseIconAction} ${tones.print}`}
      aria-label={label}
      title={label}
    >
      <PrinterIcon className="h-4 w-4" />
    </Link>
  );
}

export function WhatsappAction({
  phone,
  label = 'Abrir WhatsApp',
}: {
  phone: string;
  label?: string;
}) {
  return (
    <Link
      href={`https://api.whatsapp.com/send?phone=${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseIconAction} ${tones.whatsapp}`}
      aria-label={label}
      title={label}
    >
      <FaWhatsapp className="h-4 w-4" />
    </Link>
  );
}

/**
 * Destructive action guarded by a press-and-hold.
 * Works with pointer (mouse/touch) and keyboard (hold Enter or Space).
 */
export function DeleteAction({
  action,
  label = 'Segure para excluir',
  holdTime = 3000,
}: {
  action: () => Promise<unknown>;
  label?: string;
  holdTime?: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  const cancelHold = useCallback(() => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
  }, []);

  const startHold = useCallback(() => {
    if (isDeleting) return;

    setHoldProgress(0);
    const start = Date.now();

    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setHoldProgress(Math.min(elapsed / holdTime, 1));
    }, 50);

    holdTimeout.current = setTimeout(async () => {
      if (holdInterval.current) clearInterval(holdInterval.current);
      setIsDeleting(true);
      try {
        await action();
      } finally {
        setIsDeleting(false);
        setHoldProgress(0);
      }
    }, holdTime);
  }, [action, holdTime, isDeleting]);

  return (
    <button
      type="button"
      disabled={isDeleting}
      className={`relative ${baseIconAction} ${tones.delete} overflow-hidden disabled:cursor-wait`}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onBlur={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!event.repeat) startHold();
        }
      }}
      onKeyUp={cancelHold}
      aria-label={label}
      title={label}
    >
      {!isDeleting && holdProgress > 0 && (
        <span
          className="absolute left-0 top-0 h-full bg-red-500 opacity-50"
          style={{ width: `${holdProgress * 100}%`, transition: 'width 50ms linear' }}
        />
      )}
      {isDeleting ? (
        <svg
          className="relative z-10 h-4 w-4 animate-spin text-red-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <TrashIcon className="relative z-10 h-4 w-4" />
      )}
    </button>
  );
}
