/**
 * Placeholder row used by the table skeletons in the private area.
 */
export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-slate-100 last-of-type:border-none">
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100"></div>
          <div className="h-6 w-24 rounded bg-slate-100"></div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-slate-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-slate-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-slate-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-slate-100"></div>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-slate-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-slate-100"></div>
        </div>
      </td>
    </tr>
  );
}
