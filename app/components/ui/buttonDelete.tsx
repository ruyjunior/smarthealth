'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';

export function ButtonDelete({ deletefunction }: { deletefunction: () => Promise<void> }) {
  const deleteId = deletefunction.bind(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTime = 3000; // 3 segundos

  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setHoldProgress(0);
    let start = Date.now();
    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setHoldProgress(Math.min(elapsed / holdTime, 1));
    }, 50);
    holdTimeout.current = setTimeout(async () => {
      if (holdInterval.current) clearInterval(holdInterval.current);
      setIsDeleting(true);
      await deleteId();
      setIsDeleting(false);
      setHoldProgress(0);
    }, holdTime);
  };

  const cancelHold = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
  };

  return (
    <button
      type="button"
      disabled={isDeleting}
      className={`relative rounded-md border p-2 overflow-hidden ${
        isDeleting ? 'bg-red-300 animate-pulse' : 'hover:bg-red-300'
      }`}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      aria-label="Segure para deletar"
    >
      {/* Barra de progresso */}
      {!isDeleting && holdProgress > 0 && (
        <span
          className="absolute left-0 top-0 h-full bg-red-500 opacity-50"
          style={{ width: `${holdProgress * 100}%`, transition: 'width 50ms linear' }}
        />
      )}
      {isDeleting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </span>
      ) : (
        <TrashIcon className="w-5 relative z-10" />
      )}
    </button>
  );
}
