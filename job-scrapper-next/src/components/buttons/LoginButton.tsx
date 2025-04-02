"use client";

import React from "react";
import { Link } from "@heroui/react";

const LoginButton: React.FC = () => {
  return (
    <Link
      className="px-4 py-2 bg-transparent text-white border-green-500 border border-solid transition-colors hover:bg-green-300 hover:text-green-900 rounded-full"
      href="/auth/signin">
      Login/Register
    </Link>
  );
};

export default LoginButton;
