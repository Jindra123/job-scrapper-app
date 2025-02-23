import React from "react";
import JobListingCard, {
  JobListingCardProps,
} from "@/components/JobListingCard";

interface JobsScrollGridProps {
  jobs: JobListingCardProps[]; // Replace any with the actual type of your job data
}

const JobsScrollGrid: React.FC<JobsScrollGridProps> = ({ jobs }) => {
  return (
    <div className="overflow-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {jobs.map((job, index) => (
        <JobListingCard
          key={index}
          company={job.company}
          location={job.location}
          position={job.position}
        />
      ))}
    </div>
  );
};

export default JobsScrollGrid;
