import Hero from "./site/sections/hero";
import Services from "./site/sections/services";
import About from "./site/sections/about";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Health App',
  description: 'Sua clínica online, na palma da sua mão!',
};

export default async function Page() {
  return (
    <div className=" text-gray-900 ">
      <Hero />
      <Services />
      <About />
    </div>
  );
}