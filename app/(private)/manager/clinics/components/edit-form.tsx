'use client';
import { useActionState, useState, useTransition } from 'react';
import { Clinic } from '@/app/query/clinics/definitions';
import { TagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateClinic, State } from '@/app/query/clinics/actions';
import { upload } from '@vercel/blob/client';
import Image from 'next/image';

export default function EditclinicForm({ clinic }: { clinic: Clinic }) {
  const initialState: State = { message: null, errors: {} };
  const updateclinicWithId = updateClinic.bind(null, clinic.id);
  const [state, formAction] = useActionState(updateclinicWithId, initialState);
  const [logoUrl, setLogoUrl] = useState<string | null>(clinic.logourl ?? null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Upload logo ao selecionar arquivo
  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setLogoUrl(newBlob.url);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  }


  return (
    <form onSubmit={handleSubmit}>
      {/* Mensagem Carregando */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 text-blue-700">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Processando...
          <Image src='/ecg.gif' alt="logo App" width={200} height={200} />
        </div>
      ) : (

        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Título
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Insira um Título"
                  defaultValue={clinic.title}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="title-error"
                />
                <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.title &&
                  state.errors.title.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="mb-4">
            <label htmlFor="logo" className="mb-2 block text-sm font-medium">
              Logo da clínica
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                  onChange={handleLogoChange}
                  disabled={uploading}
                />
                <span className='text-sm '>
                  Imagens jpg, jpeg, png com tamanho de no máximo 1MB - 200x200
                </span>

              </div>
              <div>
                {uploading && <p className="text-xs text-blue-600 mt-1">Enviando logo...</p>}
                {logoUrl && (
                  <div className="mt-2">
                    <img src={logoUrl} alt="Preview" className="h-20 rounded-md" />
                    <input type="hidden" name="logourl" value={logoUrl} />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      )}

      {/* Botões */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/clinics"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending} aria-disabled={isPending || uploading}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Salvando...
            </span>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>

    </form>
  );
}