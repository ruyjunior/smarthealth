import Sidebar from '@/app/components/main/Sidebar';
import AppUpdateBanner from '@/app/components/ui/app-update-banner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-row bg-slate-100">
      <Sidebar />
      <main className="min-w-0 w-full flex-grow bg-slate-100 p-3 sm:p-4 lg:p-6">
        <AppUpdateBanner />
        {children}
      </main>
    </div>
  );
}
