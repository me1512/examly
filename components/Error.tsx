// components/Error.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

interface ErrorProps {
  code?: number;
  message?: string;
}

const defaultMessages: Record<number, string> = {
  403: "You don't have permission to access this page.",
  404: "The page you're looking for might have been moved or doesn't exist.",
  500: "Something went wrong on our end. Please try again later.",
};

const Error: React.FC<ErrorProps> = ({ code, message }) => {
  const errorCode = code ?? 404;
  const errorMessage =
    message ?? defaultMessages[errorCode] ?? "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl rounded-2xl border border-white/40 bg-white/30 p-8 text-center shadow-xl backdrop-blur-md sm:p-12 dark:border-white/10 dark:bg-white/5"
      >
        {/* Animated Error Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[6rem] font-extrabold text-indigo-300 sm:text-[8rem] dark:text-indigo-900/30"
        >
          {errorCode}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-4xl font-bold text-gray-800 dark:text-white"
        >
          {errorCode === 404
            ? " Not Found"
            : errorCode === 403
              ? "Access Denied"
              : errorCode === 500
                ? "Internal Server Error"
                : "Oops!"}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
        >
          {errorMessage}
        </motion.p>

        {/* Bouncing Dots */}
        <div className="mb-10 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-indigo-500 dark:bg-indigo-400"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button className="px-6 py-3 text-lg shadow transition-all duration-300 hover:shadow-indigo-300/30 dark:hover:shadow-indigo-500/10">
              Go Home
            </Button>
          </Link>
          <Link href="/mock">
            <Button
              variant="outline"
              className="border-indigo-500 px-6 py-3 text-lg text-indigo-600 transition-all hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
            >
              Practice Again
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;
