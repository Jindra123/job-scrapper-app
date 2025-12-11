"use client";

import React from "react";
import { useJobStore } from '@/store/job-store';
import JobListingCard from "@/components/JobListingCard";
import Link from "next/link";
import PaginationControls from "./PaginationControls"; // Import the new component

const JobsScrollGrid: React.FC = () => {
  const { listOfJobs, currentPage, totalPages, fetchJobs, isPending } = useJobStore();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className="overflow-y-scroll overflow-x-hidden grid grid-cols-1 max-h-[50vh] width mb-10 gap-4 [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-neutral-500
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {listOfJobs.map((job, index) => (
          <Link key={index} href={`/jobs/${job.id}`} className="block">
            <JobListingCard
              company={job.creator?.name || ""}
              location={job.location}
              title={job.title}
              experience={job.experience}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              currency={job.currency}
            />
          </Link>
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchJobs}
      />
    </>
  );
};

export default JobsScrollGrid;
