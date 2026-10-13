import React from 'react';
import SafeImage from '@/app/components/ui/safe-image';
import Link from 'next/link';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Team: React.FC = () => {
  return (
    <section id="team" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-blue-50" />

      <div className="relative mx-auto max-w-5xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Nossa equipe
        </span>

        <h2 className="mb-12 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Pessoas por trás da tecnologia
        </h2>

        <div className="mx-auto max-w-md rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_25px_75px_rgba(37,99,235,0.12)]">
          <div className="mb-5 flex justify-center">
            <SafeImage
              src="/images/team/ruy.jpg"
              width={120}
              height={120}
              alt="Ruy Junior"
              className="rounded-full border-4 border-blue-100 object-cover shadow-lg"
              fallback={
                <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-blue-100 bg-blue-50 text-3xl font-extrabold text-blue-700 shadow-lg">
                  RJ
                </span>
              }
            />
          </div>

          <h3 className="text-2xl font-bold text-slate-800">Ruy Junior</h3>
          <p className="mt-3 text-base text-slate-600">Automation Analyst and Systems Developer.</p>

          <div className="mt-6 flex items-center justify-center gap-6 text-blue-600">
            <Link
              href="https://www.linkedin.com/in/ruyjunior21"
              className="inline-flex items-center gap-2 font-semibold transition hover:text-blue-800"
            >
              <FaLinkedin size={22} />
              <span>LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/ruyjunior"
              className="inline-flex items-center gap-2 font-semibold transition hover:text-blue-800"
            >
              <FaGithub size={22} />
              <span>Github</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
