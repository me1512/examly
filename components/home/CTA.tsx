import { ArrowRight, CheckCircle } from "lucide-react";
import React from "react";

const CTA = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-20 sm:px-6 lg:px-8 dark:from-blue-600/20 dark:to-purple-600/20">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Ready to Transform Education?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-700 dark:text-gray-300">
              Join thousands of educators who are already creating engaging,
              effective learning experiences with Examly.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="flex items-center space-x-2 rounded-xl bg-gray-900 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-2xl dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
