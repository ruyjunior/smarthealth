import Hero from './site/sections/hero';
import Services from './site/sections/services';
import Guides from './site/sections/guides';
import About from './site/sections/about';
import Clients from './site/sections/clients';
import Team from './site/sections/team';
import CallToAction from './site/sections/call_to_action';
import { Metadata } from 'next';
import YouTubeEmbed from './site/sections/YouTubeEmbed';

export const metadata: Metadata = {
  title: 'Smart Health App',
  description: 'Sua clínica online, na palma da sua mão!',
};

// A vitrine de clientes lê as logos das clínicas do banco; sem isso a página
// congelaria esses dados até o próximo build.
export const revalidate = 3600;

const videoId = '-qrYjDDNlUU?si=NXH_X1_2EkD7qTNM';

export default async function Page() {
  return (
    <div className="text-gray-900">
      <Hero />
      <Services />
      <Guides />
      <YouTubeEmbed videoId={videoId} title="Apresentação do Smart Health" />
      <About />
      <Clients />
      <Team />
      <CallToAction />
    </div>
  );
}
