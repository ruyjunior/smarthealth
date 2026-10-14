import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const CallToAction: React.FC = () => {
  return (
    <section id="call" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white" />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Fale conosco
        </span>

        <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Pronto para transformar sua clínica?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Estamos prontos para mostrar como o Smart Health pode modernizar sua operação, melhorar a
          experiência do paciente e aumentar a eficiência da sua equipe.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="mailto:autoricbr@gmail.com"
            className="group flex items-center justify-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-[0_18px_50px_rgba(148,163,184,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaEnvelope size={20} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Email
              </span>
              <span className="block text-base font-semibold text-slate-800">
                autoricbr@gmail.com
              </span>
            </span>
          </Link>

          <Link
            href="https://wa.me/5551992274105"
            className="group flex items-center justify-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-[0_18px_50px_rgba(148,163,184,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_25px_70px_rgba(16,185,129,0.12)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FaWhatsapp size={20} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                WhatsApp
              </span>
              <span className="block text-base font-semibold text-slate-800">
                +55 51 99227-4105
              </span>
            </span>
          </Link>

          <Link
            href="https://www.instagram.com/autoricbr"
            className="group flex items-center justify-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-[0_18px_50px_rgba(148,163,184,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_25px_70px_rgba(236,72,153,0.12)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <FaInstagram size={20} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Instagram
              </span>
              <span className="block text-base font-semibold text-slate-800">@autoricbr</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
