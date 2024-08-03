import Header from "./header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

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
        <body className={inter.className}>
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-between p-24 text-xl bg-lime-400">
            <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex">
              {children}
            </div>
          </main>
        </body>
      </UserProvider>
    </html>
  );
}
