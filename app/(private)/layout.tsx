'use client'
import { ReactNode } from "react";
import Sidebar from "@/app/components/main/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div>
        <Sidebar />
      </div>
      <div className="flex-grow md:overflow-y-auto md:ml-64 ml-20 p-6">
        {children}
      </div>
    </div>
  );
}