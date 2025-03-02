"use client";

import { logout } from "@/lib/actions/auth";
import React from "react";

const SignOutButton: React.FC = () => {
  return (
    <button
      className="px-4 py-2 border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-gray-100 hover:text-background rounded-full"
      onClick={() => logout()}
    >
      Logout
    </button>
  );
};

export default SignOutButton;
