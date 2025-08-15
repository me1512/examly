import { BookOpen } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <>
      {" "}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                Examly
              </span>
            </div>

            <div className="flex space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a
                href="privacy"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="terms"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Terms of Service
              </a>
              <a
                href="contact"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p className="font-medium">
              &copy; {Date.now().toString().slice(2)} Examly. All rights
              reserved. Empowering education through technology.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
