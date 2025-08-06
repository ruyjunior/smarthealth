import Hero from "./site/sections/hero";
import Services from "./site/sections/services";
import About from "./site/sections/about";
import { Metadata } from 'next';
import YouTubeEmbed from "./site/sections/YouTubeEmbed";

export const metadata: Metadata = {
  title: 'Smart Health App',
  description: 'Sua clínica online, na palma da sua mão!',
};

const videoId = "-qrYjDDNlUU?si=NXH_X1_2EkD7qTNM";


export default async function Page() {
  return (
    <div className=" text-gray-900 ">
      <Hero />
      <Services />
      <YouTubeEmbed videoId={videoId} title="Apresentação do Smart Health" />
      <About />
    </div>
  );
}