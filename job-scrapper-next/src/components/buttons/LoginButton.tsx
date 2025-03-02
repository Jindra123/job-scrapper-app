"use client";

import React from "react";

const LoginButton: React.FC = () => {
  return (
    <a
      className="px-4 py-2 border border-solid border-black/[.08] dark:border-pink-900/[.445] transition-colors hover:bg-gray-100 hover:text-background rounded-full"
      href="/auth/signin"
    >
      Login
    </a>
  );
};

export default LoginButton;
