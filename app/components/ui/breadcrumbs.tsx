import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from './fonts';
import { FaChevronRight } from 'react-icons/fa';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl items-center')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} aria-current={breadcrumb.active} className="flex items-center">
            <Link 
              href={breadcrumb.href} 
              className={clsx(
                'flex items-center gap-2 px-3 py-1 rounded-lg',
                breadcrumb.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <FaChevronRight className="mx-2 text-gray-500" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
