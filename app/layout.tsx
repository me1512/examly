import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ThemeProvider from "@/provider/ThemeProvider";
import NavItems from "@/components/navigation/Nav";
import Footer from "@/components/navigation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Examly App",
  description:
    "Your personal exam coach—generating quizzes, analyzing mistakes, and optimizing study time for peak performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Runs before hydration to avoid flash */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function() {
            try {
              const storedTheme = localStorage.getItem("theme") || "system";
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const isDark = storedTheme === "dark" || (storedTheme === "system" && prefersDark);
              if (isDark) document.body.classList.add("dark");
            } catch (_) {}
          })();`}
        </Script>
        <ThemeProvider>
          {/* Navigation */}
          <NavItems />
          {children}
          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
