import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/provider/ThemeProvider";
import NavItems from "@/components/navigation/Nav";
import Footer from "@/components/navigation/Footer";
import { fontSans } from "@/config/fonts";
import { fontMono } from "@/config/fonts";
import { cn } from "@/lib/utils";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Minimal inline script to prevent flash - only sets classes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme-storage") || "system";
                const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme:dark)").matches);
                if (dark) document.documentElement.classList.add("dark");
              } catch(e) {
                if (matchMedia("(prefers-color-scheme:dark)").matches) document.documentElement.classList.add("dark");
              }
            `,
          }}
        />
      </head>
      <body className={cn("antialiased", fontSans.variable, fontMono.variable)}>
        {/* No script - let React handle everything */}
        <ThemeProvider>
          <NavItems />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
