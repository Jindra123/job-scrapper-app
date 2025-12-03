"use client";

import { useContext, useEffect } from "react";
import AppContext from "@/components/AppContext";

const Searchbar = () => {
  const {
    setListOfJobs, // Not directly used here, but part of context
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    employmentType,
    setEmploymentType,
    remote,
    setRemote,
    experienceLevel,
    setExperienceLevel,
    sourceFilter,
    setSourceFilter,
    fetchJobs, // The actual function to trigger search
  } = useContext(AppContext);

  // Trigger initial search when component mounts or filters change
  useEffect(() => {
    fetchJobs(searchQuery, location, employmentType, remote, experienceLevel, sourceFilter);
  }, [fetchJobs, searchQuery, location, employmentType, remote, experienceLevel, sourceFilter]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchQuery, location, employmentType, remote, experienceLevel, sourceFilter);
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-4">
      <h1 className="text-3xl font-bold text-center text-pink-500 mb-2">
        Find Your Next Opportunity
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Search for jobs from all over the web.
      </p>
      <form
        onSubmit={handleSearch}
        className="bg-transparent shadow-2xl rounded-lg p-4"
      >
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by title, company, or keyword..."
            className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white rounded-full px-6 py-2 hover:bg-pink-700 transition-colors duration-300 ml-2"
          >
            Search
          </button>
        </div>

        {/* New Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Location (e.g., 'Prague')"
            className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Employment Type</option>
            <option value="Full-time" className="text-white bg-gray-700">Full-time</option>
            <option value="Part-time" className="text-white bg-gray-700">Part-time</option>
            <option value="Contract" className="text-white bg-gray-700">Contract</option>
            <option value="Internship" className="text-white bg-gray-700">Internship</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Experience Level</option>
            <option value="Entry-level" className="text-white bg-gray-700">Entry-level</option>
            <option value="Junior" className="text-white bg-gray-700">Junior</option>
            <option value="Mid-level" className="text-white bg-gray-700">Mid-level</option>
            <option value="Senior" className="text-white bg-gray-700">Senior</option>
            <option value="Lead" className="text-white bg-gray-700">Lead</option>
          </select>

          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer text-gray-400">
              <input
                type="checkbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                className="h-4 w-4 text-pink-600 bg-transparent border-gray-600 rounded focus:ring-pink-500"
              />
              <span className="ml-2">Remote</span>
            </label>
          </div>
        </div>

        {/* Existing Source Filter */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="source"
              value="all"
              checked={sourceFilter === "all"}
              onChange={() => setSourceFilter("all")}
              className="h-4 w-4 text-pink-600 bg-transparent border-gray-600 focus:ring-pink-500"
            />
            <span className="ml-2">All Jobs</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="source"
              value="website"
              checked={sourceFilter === "website"}
              onChange={() => setSourceFilter("website")}
              className="h-4 w-4 text-pink-600 bg-transparent border-gray-600 focus:ring-pink-500"
            />
            <span className="ml-2">From Website</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="source"
              value="scraped"
              checked={sourceFilter === "scraped"}
              onChange={() => setSourceFilter("scraped")}
              className="h-4 w-4 text-pink-600 bg-transparent border-gray-600 focus:ring-pink-500"
            />
            <span className="ml-2">Scraped</span>
          </label>
        </div>
      </form>
    </div>
  );
};
export default Searchbar;
