"use client";

import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import GettingStarted from "@/components/home/GettingStarted";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";

const ExamlyLanding = () => {
  return (
    <div className="min-h-screen overflow-hidden text-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 dark:text-white">
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Getting Started Section */}
      <GettingStarted />

      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default ExamlyLanding;
