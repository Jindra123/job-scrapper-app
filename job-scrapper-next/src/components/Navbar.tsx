"use server";

import SignOutButton from "@/components/buttons/SignOutButton";
import { auth } from "@/auth";
import LoginButton from "./buttons/LoginButton";
import CompaniesButton from "./buttons/CompaniesButton";
import CreateJobButton from "./buttons/CreateJobButton";
import ServerToast from "./ServerToast";

const Navbar = async () => {

  try {
    const session = await auth();
    console.log(session);
    
    return (
    <header className="w-full max-w-5xl mx-auto">
      <nav className="flex justify-between items-center py-4 px-4">
        <div className="text-lg font-semibold text-white">NextJobs</div>
        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              <span className="text-white text-sm font-medium">
                {session.user.email}
              </span>
              {session?.user.role === "COMPANY" && (
                <CreateJobButton/>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <LoginButton/>
              <CompaniesButton/>
            </>
          )}
        </div>
      </nav>
    </header>
  );
  } catch (error) { // Handle error if session fetching fails
    console.error("Error fetching session:", error);
    return <ServerToast title={"Session error"} description={"An unexpected error occurred. Please try again later."} color="danger" />;
  } 
};

export default Navbar;
