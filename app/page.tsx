"use client";
import { ClientProfileProps } from "@/types";
import { useUser } from "@auth0/nextjs-auth0/client";

function ProfileClient({ user }: ClientProfileProps) {
  return (
    user && (
      <div className="flex flex-col items-center bg-lime-500 p-4">
        <img
          src={user.picture}
          alt={user.name}
          className="w-24 h-24 rounded-full mb-4"
        />
        {user.name !== user.email ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
            <p className="text-lg text-gray-700 mb-4">{user.email}</p>
          </>
        ) : (
          <h2 className="text-2xl font-semibold mb-2">{user.email}</h2>
        )}
        <a href="/inventory" className="text-blue-500 hover:underline">
          Manage Your Pantry
        </a>
      </div>
    )
  );
}

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-gray-500 text-xxl">
        Loading...
      </div>
    );
  } else if (error) {
    return (
      <div className="flex justify-center items-center text-rose-500 text-xxl">
        {error.message}
      </div>
    );
  }

  if (user) {
    return <ProfileClient user={user} />;
  } else {
    return <div>Welcome!</div>;
  }
}
