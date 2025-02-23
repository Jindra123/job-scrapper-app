import React from "react";

export interface JobListingCardProps {
  company?: string;
  position?: string;
  description?: string;
  experience?: string;
  salary?: string;
  imageUrl?: string;
  location?: string;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
  company,
  position,
  location,
}) => {
  return (
    <div className="m-5">
      <div className="group mx-2 mt-10 grid max-w-screen-md grid-cols-12 space-x-8 overflow-hidden rounded-md border py-8 text-white shadow transition hover:shadow-lg sm:mx-auto duration-300 hover:rotate-1">
        <div className="col-span-11 mx-2 flex flex-col pr-8 text-left sm:pl-4">
          <h3 className="text-sm text-pink-500">{company}</h3>
          <a
            href="#"
            className="mb-3 overflow-hidden pr-7 text-lg font-semibold sm:text-xl"
          >
            {position}
          </a>
          <p className="overflow-hidden pr-7 text-gray-400 text-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna .
          </p>

          <div className="mt-5 flex flex-col space-y-3 text-sm font-medium text-gray-400 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <div className="">
              Experience:
              <span className="ml-2 mr-3 rounded-full bg-purple-100 px-2 py-0.5 text-purple-900">
                2 Years
              </span>
            </div>
            <div className="">
              Salary:
              <span className="ml-2 mr-3 rounded-full bg-blue-100 px-2 py-0.5 text-blue-900">
                180-250k
              </span>
            </div>
            <div className="">
              Location:
              <span className="ml-2 mr-3 rounded-full bg-blue-100 px-2 py-0.5 text-blue-900">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingCard;
