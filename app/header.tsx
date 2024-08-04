"use client";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
  const { user, error, isLoading } = useUser();

  if (error) return <div>{error.message}</div>;

  return (
    <header className="flex justify-between items-center p-2 bg-lime-500 border-b-2 border-lime-500 text-xl">
      <div className="w-1/4">
        <a href="/" className="w-full flex items-center">
          <Image src="/icon.png" alt="Pantry app icon" width={32} height={32} />
          <h1 className="font-bold text-black ml-2">Pantry Tracker</h1>
        </a>
      </div>
      {isLoading && (
        <div className="w-25 bg-lime-600 border-2 border-black p-2 font-bold text-center">
          Loading
        </div>
      )}

      {!isLoading && !user && (
        <a
          href="/api/auth/login"
          className="flex justify-center items-center bg-lime-600 border-2 border-black p-2 font-bold text-center"
        >
          Sign In/Up
        </a>
      )}

      {!isLoading && user && (
        <a
          href="/api/auth/logout"
          className="flex justify-center items-center bg-lime-600 border-2 border-black p-2 font-bold text-center"
        >
          Sign Out
        </a>
      )}
    </header>
  );
}
