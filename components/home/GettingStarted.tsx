import { ArrowRight } from "lucide-react";
import React from "react";
import { steps } from "@/components/home/consts";

const GettingStarted = () => {
  return (
    <>
      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="bg-white/70 px-4 py-20 backdrop-blur-sm sm:px-6 lg:px-8 dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Get Started in Minutes
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Follow our simple 5-step process to transform your educational
              experience
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-500 transition-transform hover:scale-110" />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl">
              <span>Begin Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GettingStarted;
