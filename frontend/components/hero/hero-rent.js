import Image from "next/image";

const Hero = () => {
  return (
    <section className="hero relative py-20">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={900}
          src="/images/gradient.jpg"
          alt="gradient"
          className="w-full h-full object-cover"
        />
      </picture>
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
        <Image
          width={1519}
          height={712}
          src="/images/gradient_dark.jpg"
          alt="gradient dark"
          className="w-full h-full object-cover"
        />
      </picture>
      <div className="container">
        <div className="mx-auto max-w-2xl pt-24 text-center">
          <h1 className="font-display text-5xl text-jacarta-700 dark:text-white lg:text-6xl xl:text-7xl">
            <span className="animate-gradient">
              Rent them. Use them. {" "}
            </span>
            It's that simple.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
