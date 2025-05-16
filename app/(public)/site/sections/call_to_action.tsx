import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const CallToAction: React.FC = () => {
  return (
    <section id="call"
      className="py-20 text-center">
      <h2 className="text-3xl font-bold">
        Contact Us</h2>
      <p className="mt-4 text-center">We are ready to help transform your company with our technological solutions.</p>
      <div className="flex justify-center flex-wrap mt-10 gap-6">
        <div className="flex items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
          <Link href="mailto:autoricbr@gmail.com" className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <FaEnvelope className="text-blue-500" size={24} />
            <h3 className="text-gray-800">autoricbr@gmail.com</h3>
          </Link>
        </div>
        <div className="flex items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
          <Link href="https://wa.me/5571991258769" className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <FaWhatsapp className="text-green-500" size={24} />
            <h3 className="text-gray-800">+55 71 99125-8769</h3>
          </Link>
        </div>
        <div className="flex items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
          <Link href="https://www.instagram.com/autoricbr" className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <FaInstagram className="text-pink-500" size={24} />
            <h3 className="text-gray-800">@autoricbr</h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;