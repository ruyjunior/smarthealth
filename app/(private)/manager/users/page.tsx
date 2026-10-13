import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateUser } from './components/buttons';
import { UsersTableSkeleton } from './components/skeletons';
import { fetchUsersPages } from '@/app/domains/users/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Usuários',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: string;
  }>;
}) {
  const idclinic = await getCurrentClinicId();
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchUsersPages(idclinic, query);
  const successMsg = searchParams?.success || '';

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Usuários', href: '/manager/users', active: true },
      ]}
      eyebrow="Gerência"
      title="Usuários"
      subtitle="Profissionais e acessos vinculados à clínica."
      action={<CreateUser />}
      search={
        <div className="space-y-4">
          {successMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
              {successMsg}
            </div>
          )}
          <Search placeholder="Procurar usuário..." />
        </div>
      }
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </ListPageShell>
  );
}
