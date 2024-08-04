"use client";
import { ClientProfileProps } from "@/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

function ProfileClient({ user }: ClientProfileProps) {
  return (
    user && (
      <div className="flex flex-col items-center bg-lime-500 p-4">
        <Image
          src={user.picture as string}
          alt={user.name as string}
          height={100}
          width={100}
          className="border-2 border-white-500 rounded-full mb-4"
        />
        {user.name !== user.email ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
            <p className="text-lg text-gray-700 mb-4">{user.email}</p>
          </>
        ) : (
          <h2 className="text-2xl font-semibold mb-2">{user.email}</h2>
        )}
        <a
          href="/inventory"
          className="bg-green-500 text-white py-2 px-4 rounded-full text-xl font-semibold hover:bg-lime-600 transition duration-200"
        >
          Manage Your Pantry
        </a>
      </div>
    )
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center m-4">
      <header className="w-full p-4 bg-lime-500 text-white text-center text-2xl font-bold">
        Pantry Tracker
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <Image src="/icon.png" alt="pantry icon" height={100} width={100} />
        <h1 className="text-4xl font-extrabold text-gray-800 m-4">
          Keep Track of Your Pantry Items
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Easily manage your pantry inventory with our intuitive tracker. Know
          what you have, what you need, and never run out of your essentials.
        </p>
        <a
          href="/api/auth/login"
          className="bg-lime-500 text-white py-2 px-4 rounded-full text-xl font-semibold hover:bg-lime-600 transition duration-200"
        >
          Get Started
        </a>
      </main>

      <section className="w-full bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Why Choose Pantry Tracker?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Our user-friendly interface makes it easy to add, edit, and
                remove items from your pantry inventory.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Always Know Your Stock!
              </h3>
              <p className="text-gray-600">
                Accurately monitor the quantity of every item in your pantry.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Accessible Anywhere
              </h3>
              <p className="text-gray-600">
                Access your pantry inventory from any device, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
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
    return <LandingPage />;
  }
}
