import { Suspense } from "react";
//import { useRouter } from "next/navigation";
import LoginForm from "./components/login-form";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LOGIN',
  description: 'Página de login do Smart Health App',
};

export default function LoginPage() {
  return (
    <div className="text-gray-900">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
