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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
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
    </div>
  );
};

export default JobsScrollGrid;
