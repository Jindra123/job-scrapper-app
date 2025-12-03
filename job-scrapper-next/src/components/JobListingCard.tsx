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
    <div className="m-5">
      <div className="group mx-2 mt-10 grid max-w-screen-md grid-cols-12 space-x-8 overflow-hidden rounded-md border py-8 text-white shadow transition hover:shadow-lg sm:mx-auto duration-300 hover:rotate-1">
        <div className="col-span-11 mx-2 flex flex-col pr-8 text-left sm:pl-4">
          <h3 className="text-sm text-pink-500">{company}</h3>
          <h1 className="mb-3 overflow-hidden pr-7 text-lg font-semibold sm:text-xl">
            {title}
          </h1>
          
          <div className="mt-5 flex flex-col space-y-3 text-sm font-medium text-gray-400 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <div className="">
              Experience:
              <span className="ml-2 mr-3 rounded-full bg-purple-100 px-2 py-0.5 text-purple-900">
                {experience || "N/A"}
              </span>
            </div>
            <div className="">
              Salary:
              <span className="ml-2 mr-3 rounded-full bg-blue-100 px-2 py-0.5 text-blue-900">
                {salaryDisplay}
              </span>
            </div>
            <div className="">
              Location:
              <span className="ml-2 mr-3 rounded-full bg-green-100 px-2 py-0.5 text-green-900">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobListingCard);

