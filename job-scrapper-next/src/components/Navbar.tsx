"use server";

import SignOutButton from "@/components/buttons/SignOutButton";
import { auth } from "@/auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  console.log(session);

  return (
    <header className="w-full max-w-5xl mx-auto">
      <nav className="flex justify-between items-center py-4 px-4">
        <div className="text-lg font-semibold text-white">NextJobs</div>
        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              {/* Display email */}
              <span className="text-white text-sm font-medium">
                {session.user.email}
              </span>
              {/* Logout button with reddish styling */}
              <SignOutButton />
            </>
          ) : (
            <>
              {/* Login/Register Button */}
              <Link href="/auth/signin">
                <button className="px-4 py-2 border border-solid border-purple-500/[.8] text-white transition-colors hover:bg-purple-200 hover:text-purple-900 rounded-full">
                  Login / Register
                </button>
              </Link>
              {/* For Companies Button */}
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
