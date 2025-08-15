import { CheckCircle, Star, Trophy } from "lucide-react";
import React from "react";

const Pricing = () => {
  return (
    <>
      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Choose Your Plan
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Flexible pricing options designed to grow with your educational
              needs
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Basic
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹149
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Perfect for individual educators getting started
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Up to 10 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      5 interactive modules
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Basic analytics
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Email support
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-800 transition-all duration-300 hover:scale-105 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Professional Plan - Featured */}
            <div className="relative scale-105 rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-2xl dark:bg-gray-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 shadow-lg">
                  <Trophy className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    Most Popular
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Professional
                </h3>
                <div className="mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
                    ₹349
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Ideal for schools and growing institutions
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Up to 50 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Unlimited modules
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Advanced analytics
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Custom learning paths
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Assessment tools
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Enterprise
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹1449
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Complete solution for large organizations
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      500 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      All features included
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      White-label options
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      API access
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      24/7 dedicated support
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Custom integrations
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 sm:flex-row sm:space-y-0 sm:space-x-8 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">30-day money back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Free migration support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
