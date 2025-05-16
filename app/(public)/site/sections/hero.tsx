import Image from "next/image";
const bannerAddres = '/images/hero/hero.png'; // Replace with your image path
const Hero = () => {
  return (
    <>
      <section className="relative h-[40vh] md:h-[80vh]">
        <Image
          src={bannerAddres}
          alt="Background"
          width={1024}
          height={840}
          className="absolute inset-0 w-full h-auto max-h-[80vh] object-cover opacity-90"
          />
          {/* Video Background 
        <video
          className="absolute inset-0 w-full h-auto max-h-[80vh] object-cover opacity-30"
          src="/videos/background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />*/}
      </section>

      <section className="relative flex flex-col items-center justify-center text-blue-800 text-center px-6 md:pt-30 mb-0 md:mb-16">
        <div className="relative z-10 max-w-4xl px-4 mt-[-10vh] md:mt-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
            Sua clínica online, na palma da sua mão!
          </h1>
        </div>
      </section>
    </>
  );
};

export default Hero;