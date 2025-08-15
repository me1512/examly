// components/NotFound.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl text-center"
      >
        {/* Animated 404 Text */}
        <div className="relative mb-12">
          <motion.span
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10rem] font-bold text-indigo-200 sm:text-[12rem] md:text-[14rem] dark:text-indigo-900/30"
          >
            404
          </motion.span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4 text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl dark:text-white"
            >
              Page Not Found
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto h-1 rounded-full bg-indigo-500 dark:bg-indigo-400"
            />
          </div>
        </div>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mx-auto mb-12 max-w-2xl px-4 text-xl text-gray-600 dark:text-gray-300"
        >
          Oops! The page you&apos;re looking for might have been moved, removed,
          or doesn&apos;t exist. Let&apos;s get you back on track.
        </motion.p>

        {/* Animated Elements */}
        <div className="mb-12 flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1 + i * 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="h-4 w-4 rounded-full bg-indigo-500 dark:bg-indigo-400"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button className="px-8 py-3 text-lg shadow-lg transition-shadow hover:shadow-indigo-200/50 dark:hover:shadow-indigo-500/10">
              Return Home
            </Button>
          </Link>
          <Link href="/mock">
            <Button
              variant="outline"
              className="border-indigo-500 px-8 py-3 text-lg text-indigo-500 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
            >
              Start Practicing
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
