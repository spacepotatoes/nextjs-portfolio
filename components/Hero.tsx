"use client";

import dynamic from "next/dynamic";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./ui/MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

// Dynamischer Import mit NAMED export (Meteors)
const Meteors = dynamic(
  () => import("./ui/Meteors").then(mod => mod.Meteors),  // ← hier der Fix
  {
    ssr: false,
    loading: () => null,
  }
);

const Hero = () => {
  return (
    <div className="pb-20 pt-36 relative min-h-screen">
      {/* Hintergrund-Grid + Meteors */}
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        <Meteors number={30} />
        
        {/* Radial-Gradient-Maske */}
        <div
          // chnage the bg to bg-black-100, so it matches the bg color and will blend in
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      {/* Hauptinhalt */}
      <div className="relative z-10 flex justify-center my-20">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-4xl flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs md:text-sm text-center text-blue-100 max-w-80 mb-4">
            Dynamic Web Magic with Next.js
          </p>

          <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className="text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"
          />

          <p className="text-center md:tracking-wider text-base md:text-lg lg:text-xl text-gray-300 mt-6 mb-10 max-w-3xl">
            Hi! I&apos;m Adrian, a Next.js Developer based in Croatia.
          </p>

          <a href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;