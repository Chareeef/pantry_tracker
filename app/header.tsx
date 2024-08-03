"use client";
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
  const { user, error, isLoading } = useUser();

  if (error) return <div>{error.message}</div>;

  return (
    <header className="flex justify-between items-center p-2 bg-lime-500 border-b-2 border-lime-500">
      <div className="w-1/4 flex items-center">
        <img src="/icon.png" width={32} height={32} />
        <h1 className="font-bold text-black ml-2">Pantry Tracker</h1>
      </div>
      {isLoading && (
        <div className="w-25 bg-lime-600 border-2 border-black p-2 font-bold text-center">
          Loading
        </div>
      )}

      {!isLoading && !user && (
        <a
          href="/api/auth/login"
          className="w-25 bg-lime-600 border-2 border-black p-2 font-bold text-center"
        >
          Sign In
        </a>
      )}

      {!isLoading && user && (
        <a
          href="/api/auth/logout"
          className="w-25 bg-lime-600 border-2 border-black p-2 font-bold text-center"
        >
          Sign Out
        </a>
      )}
    </header>
  );
}
