import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Team: React.FC = () => {
    return (
        <section id="team"
            className="py-20 text-center">
            <h2 className="text-3xl font-bold mb-6">
                Our Team
            </h2>
            <div className="flex justify-center flex-wrap gap-6">
                <div className="flex flex-col items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
                    <Image
                        src="/images/team/ruy.jpg"
                        width={80}
                        height={80}
                        alt="Membro da Equipe 1"
                        className="rounded-full w-auto h-auto"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">Ruy Junior</h3>
                    <p className="mt-2 text-gray-600">Automation Analyst and Systems Developer.</p>
                    <Link href="https://www.linkedin.com/in/ruyjunior21" className="mt-4 text-blue-500 hover:underline flex items-center gap-2">
                        <FaLinkedin size={24} />
                        <span>LinkedIn</span>
                    </Link>
                    <Link href="https://github.com/ruyjunior" className="mt-4 text-blue-500 hover:underline flex items-center gap-2">
                        <FaGithub size={24} />
                        <span>Github</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Team;