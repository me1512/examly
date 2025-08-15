import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg- relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        {/* Background Blurr */}
        <div className="absolute inset-0 -z-[5] bg-black opacity-75"></div>
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero.webp"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            objectPosition="center" // zIndex is not a valid prop for next/image, CSS z-index should be applied via className
          />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl">
                Transform Education
              </h1>
              <h2 className="mb-6 text-3xl font-bold text-blue-400 md:text-4xl dark:text-gray-50">
                with Intelligent Learning
              </h2>
            </div>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-50 dark:text-gray-300">
              Empower educators and students with cutting-edge tools for
              interactive learning, comprehensive assessments, and real-time
              analytics that drive success.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl">
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="flex items-center space-x-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-bold text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-gray-50 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative mt-20">
            <div className="absolute top-10 left-10 h-24 w-24 animate-pulse rounded-full bg-blue-400/30 blur-xl" />
            <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-purple-400/30 blur-xl" />
            <div className="absolute bottom-10 left-1/2 h-20 w-20 animate-pulse rounded-full bg-pink-400/30 blur-xl" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
