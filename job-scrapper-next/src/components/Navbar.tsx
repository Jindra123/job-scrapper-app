"use client";

import SignOutButton from "@/components/buttons/SignOutButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-white shadow-md dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          NextJobs
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          {session?.user ? (
            <>
              <span className="text-text-light text-sm font-medium dark:text-gray-300">
                {session.user.email}
              </span>
              {session.user.type === "company" && (
                <>
                  <Link href="/company/dashboard">
                    <button className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors dark:bg-gray-800 dark:text-white dark:border-primary dark:hover:bg-primary">
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/jobs/create">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition-colors">
                      Post a Job
                    </button>
                  </Link>
                </>
              )}
              {session.user.type === "user" && (
                <>
                  <Link href="/my-applications">
                    <button className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors dark:bg-gray-800 dark:text-white dark:border-primary dark:hover:bg-primary">
                      My Applications
                    </button>
                  </Link>
                  <Link href="/user-info">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition-colors">
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
                <button className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors dark:bg-gray-800 dark:text-white dark:border-primary dark:hover:bg-primary">
                  Login / Register
                </button>
              </Link>
              <Link href="/auth/company/register">
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition-colors">
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

