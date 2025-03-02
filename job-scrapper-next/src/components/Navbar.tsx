"use server";

import LoginButton from "@/components/buttons/LoginButton";
import SignOutButton from "@/components/buttons/SignOutButton";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  console.log(session);
  return (
    <header className="w-full max-w-5xl">
      <nav className="flex justify-between items-center py-4">
        <div className="text-lg font-semibold">NextJobs</div>
        <div className="flex gap-4">
          {session?.user ? <SignOutButton /> : <LoginButton />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
