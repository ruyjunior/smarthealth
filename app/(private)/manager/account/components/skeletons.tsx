import { TableRowSkeleton } from '@/app/components/ui/skeletons';

function MobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
          <div className="md:hidden">
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
          </div>
          <table className="hidden min-w-full text-slate-800 md:table">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <tr>
                <th className="px-2 py-2">Data</th>
                <th className="px-2 py-2">Valor</th>
                <th className="px-2 py-2">Expira</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
