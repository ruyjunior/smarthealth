'use client';
import { useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteClient } from '@/app/query/clients/actions';

export function CreateClient() {
  return (
    <Link
      href="/clients/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Novo</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateClient({ id }: { id: string }) {
  return (
    <Link
      href={`/clients/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function ViewClient({ id }: { id: string }) {
  return (
    <Link
      href={`/clients/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function DeleteClient({ id }: { id: string }) {

  const deleteClientWithId = deleteClient.bind(null, id);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteClientWithId();
    setIsDeleting(false);
  };

  return (
    <button
      type="button"
      disabled={isDeleting}
      className="rounded-md border p-2 hover:bg-red-400"
      onClick={handleDelete}
    >
      {isDeleting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </span>
      ) : (
        <TrashIcon className="w-5" />
      )}
    </button>
  );
}
