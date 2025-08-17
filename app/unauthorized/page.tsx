// app/unauthorized/page.tsx
"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
        >
          <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>

        <p className="mb-8 text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
