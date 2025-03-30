"use client";

import React from "react";
import { Link } from "@heroui/react";

const CreateJobButton: React.FC = () => {
  return (
      <Link className="px-4 py-2 border border-solid border-green-500/[.8] text-white transition-colors hover:bg-green-200 hover:text-green-900 rounded-full"
          href="/jobs/create">
        Create new job offer
    </Link>
  );
};

export default CreateJobButton;
