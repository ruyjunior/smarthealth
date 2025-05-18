import Hero from "./site/sections/hero";
import Services from "./site/sections/services";
import About from "./site/sections/about";
import Clients from "./site/sections/clients";
import { Metadata } from 'next';
import CallToAction from "./site/sections/call_to_action";

export const metadata: Metadata = {
  title: 'HOME',
  description: 'Smart Health - A saúde na palma da sua mão',
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