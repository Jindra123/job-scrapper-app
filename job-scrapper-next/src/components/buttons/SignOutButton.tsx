"use client";

import { signOut } from "next-auth/react";
import React from "react";

const SignOutButton: React.FC = () => {
  return (
    <button
      className="px-4 py-2 border border-solid border-red-500/[.8] text-white transition-colors hover:bg-red-200 hover:text-red-900 rounded-full"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </button>
  );
};

export default SignOutButton;

