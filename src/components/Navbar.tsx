"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User | null = session?.user ?? null;

  return (
    <nav className="p-4 md:p-6 shadow-lg bg-gradient-to-r from-blue-900 to-purple-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-300">
          Honest Review
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-gray-200">
                Welcome, {user?.name || user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-yellow-400 text-black hover:bg-yellow-500 transition"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 transition">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
