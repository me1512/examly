import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      {" "}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center">
              <Link
                href="/"
                className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-blue-400 dark:to-blue-800"
              >
                <Image src="/logo.png" alt="Logo" width={100} height={40} />
              </Link>
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
              &copy; {new Date().getFullYear()} Examly. All rights reserved.
              Empowering education through technology.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
