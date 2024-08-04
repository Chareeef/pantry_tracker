import Header from "./header";
import Footer from "./footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pantry Tracker",
  description: "Pantry Tracker built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />

        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>

      <UserProvider>
        <body className={`flex flex-col h-dvh ${inter.className}`}>
          <Header />
          <main className="flex-grow flex flex-col justify-center items-center gap-8 text-xl bg-lime-400 p-3">
            {children}
          </main>
          <Footer />
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
