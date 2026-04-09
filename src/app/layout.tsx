import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { Toast } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingBar from "@/components/LoadingBar";
import BackToTop from "@/components/BackToTop";
import ReadingProgress from "@/components/ReadingProgress";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: { default: "Bloggie", template: "%s | Bloggie" },
  description: "A modern blog platform for developers to share knowledge, discover posts, and connect with other creators.",
  keywords: ["blog", "developer", "programming", "articles", "tech"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-neutral-100 transition-colors`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-lg">
          Skip to content
        </a>
        <ThemeProvider>
          <LoadingBar />
          <ReadingProgress />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toast />
          <BackToTop />
          <KeyboardShortcuts />
        </ThemeProvider>
      </body>
    </html>
  );
}
