import React from "react";
import { ExperienceLevel } from "@prisma/client";

export interface JobListingCardProps {
  company?: string;
  title?: string;
  experience?: ExperienceLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  location?: string;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
  company,
  title,
  location,
  experience,
  salaryMin,
  salaryMax,
  currency,
}) => {
  const salaryDisplay =
    salaryMin && salaryMax
      ? `${salaryMin/1000}k - ${salaryMax/1000}k ${currency}`
      : "Not specified";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-primary font-medium">{company}</p>
          <h2 className="text-xl font-bold text-text dark:text-white mt-1">{title}</h2>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text dark:text-white">{salaryDisplay}</p>
          <p className="text-sm text-text-light dark:text-gray-300">{location}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <span className="px-3 py-1 text-xs font-medium text-primary bg-primary bg-opacity-10 rounded-full dark:bg-opacity-20 dark:text-primary-light">
          {experience || "N/A"}
        </span>
      </div>
    </div>
  );
};

export default React.memo(JobListingCard);

