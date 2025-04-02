"use client";

import React from "react";
import { Link } from "@heroui/react";

const CompaniesButton: React.FC = () => {
  return (
    <Link
      className="px-4 py-2 border border-solid border-blue-500/[.8] text-white transition-colors hover:bg-blue-300 hover:text-blue-900 rounded-full"
      href="/auth/company/register">
      For Companies
    </Link>
  );
};

export default CompaniesButton;