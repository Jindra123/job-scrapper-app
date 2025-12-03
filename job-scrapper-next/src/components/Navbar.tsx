"use client";

import SignOutButton from "@/components/buttons/SignOutButton";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full max-w-5xl mx-auto">
      <nav className="flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-lg font-semibold text-white">
          NextJobs
        </Link>
        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              <span className="text-white text-sm font-medium">
                {session.user.email}
              </span>
              {/* @ts-ignore */}
              {session.user.type === "company" && (
                <>
                  <Link href="/company/dashboard">
                    <button className="px-4 py-2 border border-solid border-blue-500/[.8] text-white transition-colors hover:bg-blue-200 hover:text-blue-900 rounded-full">
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/jobs/create">
                    <button className="px-4 py-2 border border-solid border-green-500/[.8] text-white transition-colors hover:bg-green-200 hover:text-green-900 rounded-full">
                      Create new job offer
                    </button>
                  </Link>
                </>
              )}
              {/* @ts-ignore */}
              {session.user.type === "user" && (
                <>
                  <Link href="/my-applications">
                    <button className="px-4 py-2 border border-solid border-purple-500/[.8] text-white transition-colors hover:bg-purple-200 hover:text-purple-900 rounded-full">
                      My Applications
                    </button>
                  </Link>
                  <Link href="/user-info">
                    <button className="px-4 py-2 border border-solid border-orange-500/[.8] text-white transition-colors hover:bg-orange-200 hover:text-orange-900 rounded-full">
                      My Profile
                    </button>
                  </Link>
                </>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="px-4 py-2 border border-solid border-purple-500/[.8] text-white transition-colors hover:bg-purple-200 hover:text-purple-900 rounded-full">
                  Login / Register
                </button>
              </Link>
              <Link href="/auth/company/register">
                <button className="px-4 py-2 border border-solid border-blue-500/[.8] text-white transition-colors hover:bg-blue-200 hover:text-blue-900 rounded-full">
                  For Companies
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

