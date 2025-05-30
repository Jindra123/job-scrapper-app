"use client";

import React, { useContext } from "react";
import AppContext from "@/components/AppContext";
import JobListingCard from "@/components/JobListingCard";
import Link from "next/link";

const JobsScrollGrid: React.FC = () => {
  const { listOfJobs } = useContext(AppContext);

  return (
    <div
      className="overflow-y-scroll overflow-x-hidden grid grid-cols-1 max-h-[50vh] width mb-10 gap-4 [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {listOfJobs.map((job, index) => (
        <Link key={index} href={`/jobs/${job.id}`} className="block">
          <JobListingCard
            company={job.company}
            location={job.location}
            title={job.title}
          />
        </Link>
      ))}
    </div>
  );
};

export default JobsScrollGrid;
