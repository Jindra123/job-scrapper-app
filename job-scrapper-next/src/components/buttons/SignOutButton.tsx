"use client";

import { logout } from "@/lib/actions/auth";
import React from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";

const SignOutButton: React.FC = () => {
  return (
    <Button
      className="px-4 py-2 border border-solid bg-transparent text-white border-red-500 transition-colors hover:bg-red-300 hover:text-red-900 rounded-full"
      onPress={() =>  {
        logout();
        addToast({
          title: "Logout successful",
          color: "success"
        });
      }}
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
