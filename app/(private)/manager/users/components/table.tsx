import { UpdateUser, DeleteUser } from './buttons';
import { getCurrentClinicId } from '@/app/lib/session';
import { fetchFilteredUsers } from '@/app/domains/users/queries';
import Image from 'next/image';
import logo from '@/public/images/logo.png';
import { fetchCredits } from '@/app/domains/credit/queries';
import { isManager } from '@/app/lib/roles';

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const idclinic = await getCurrentClinicId();
  const users = await fetchFilteredUsers(idclinic, query, currentPage);
  const credits = await fetchCredits(idclinic);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              {/* Mobile View */}
              <div className="md:hidden">
                {users.map((user) => {
                  let managerName = '—';
                  if (!isManager(user.role)) {
                    const manager = users.find(
                      (u) => u.idclinic === user.idclinic && isManager(u.role),
                    );
                    managerName = manager?.name || '—';
                  }
                  const credit = credits.find((credit) => credit.email === user.email);

                  return (
                    <div
                      key={user.id}
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                    >
                      <div className="flex border-b pb-4 items-center">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {user.pronoun} {user.name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">Cargo: {user.role}</p>
                          <p className="text-sm text-gray-600">Categoria: {user.category}</p>
                          <p className="text-sm text-gray-600">Gerente: {managerName}</p>
                          <p className="text-sm text-gray-600">
                            Expira: {new Date(credit?.expires || '').toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-1">
                          <Image
                            src={user.avatarurl ? user.avatarurl : logo.src}
                            alt="Avatar"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        <UpdateUser id={user.id} />
                        {!isManager(user.role) && <DeleteUser id={user.id} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-slate-800 text-center md:table">
                <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <tr>
                    <th className="px-2 py-2">Foto</th>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Nome</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Cargo</th>
                    <th className="px-2 py-2">Categoria</th>
                    <th className="px-2 py-2">Gerente</th>
                    <th className="px-2 py-2">Licença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => {
                    let managerName = '—';
                    if (!isManager(user.role)) {
                      const manager = users.find(
                        (u) => u.idclinic === user.idclinic && isManager(u.role),
                      );
                      managerName = manager?.name || '—';
                    }
                    const credit = credits.find((credit) => credit.email === user.email);

                    return (
                      <tr key={user.id} className="bg-white/80 transition hover:bg-blue-50/80">
                        <td className="py-2 px-2 text-xs gap-2 items-center justify-center">
                          <Image
                            src={user.avatarurl ? user.avatarurl : logo.src}
                            alt="Avatar"
                            width={200}
                            height={200}
                            className="h-10 w-10 rounded-full"
                          />
                        </td>
                        <td className="py-2 px-2 flex gap-2 items-center justify-center">
                          <UpdateUser id={user.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">
                          {user.pronoun} {user.name}
                        </td>
                        <td className="px-2 py-2 text-xs">{user.email}</td>
                        <td className="px-2 py-2 text-xs">{user.role}</td>
                        <td className="px-2 py-2 text-xs">{user.category}</td>
                        <td className="px-2 py-2 text-xs">{managerName}</td>
                        <td className="px-2 py-2 text-xs">
                          {credit
                            ? new Date(credit?.expires || '').toLocaleDateString('pt-BR')
                            : 'Inativo'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
