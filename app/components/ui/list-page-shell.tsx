import Breadcrumbs from './breadcrumbs';
import { lusitana } from './fonts';

type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};

/**
 * Shared layout for the private listing pages: breadcrumb trail, gradient header,
 * optional action button, optional search bar and pagination footer.
 */
export default function ListPageShell({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  action,
  search,
  children,
  footer,
}: {
  breadcrumbs?: Breadcrumb[];
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  search?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 py-4 md:px-4">
      {breadcrumbs && (
        <div className="mx-auto mb-4 max-w-7xl">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}

      <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              {eyebrow}
            </p>
            <h1 className={`${lusitana.className} mt-2 text-3xl font-extrabold text-white`}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">{subtitle}</p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

      {search && (
        <div className="mx-auto mt-6 max-w-7xl rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur-sm md:p-5">
          {search}
        </div>
      )}

      {children}

      {footer && <div className="mt-5 flex w-full justify-center">{footer}</div>}
    </div>
  );
}
