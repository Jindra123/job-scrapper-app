"use client";

import { useCallback } from "react";
import { useJobStore } from '@/store/job-store';
import { RemoteStatus } from "@prisma/client";
import React from "react";

const Searchbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    employmentType,
    setEmploymentType,
    remoteStatus,
    setRemoteStatus,
    experienceLevel,
    setExperienceLevel,
    fetchJobs,
    isPending,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    datePosted,
    setDatePosted,
    industry,
    setIndustry,
    clearFilters,
  } = useJobStore();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      fetchJobs(1); // Always fetch the first page for a new search
    },
    [fetchJobs],
  );

  const handleSearchQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value);
    },
    [setLocation],
  );

  const handleEmploymentTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEmploymentType(e.target.value);
    },
    [setEmploymentType],
  );

  const handleExperienceLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setExperienceLevel(e.target.value);
    },
    [setExperienceLevel],
  );

  const handleRemoteStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRemoteStatus(e.target.value as RemoteStatus | "");
    },
    [setRemoteStatus],
  );

  const handleSalaryMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSalaryMin(e.target.value);
    },
    [setSalaryMin],
  );

  const handleSalaryMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSalaryMax(e.target.value);
    },
    [setSalaryMax],
  );

  const handleDatePostedChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDatePosted(e.target.value);
    },
    [setDatePosted],
  );

  const handleIndustryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIndustry(e.target.value);
    },
    [setIndustry],
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
    fetchJobs(1);
  }, [clearFilters, fetchJobs]);

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
            className="w-full bg-transparent text-white placeholder-gray-400 border rounded-md border-pink-600 px-4 py-2 focus:outline-none"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white rounded-full px-6 py-2 hover:bg-pink-700 transition-colors duration-300 ml-2"
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Location (e.g., 'Prague')"
            className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            value={location}
            onChange={handleLocationChange}
          />
          <select
            value={employmentType}
            onChange={handleEmploymentTypeChange}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Employment Type</option>
            <option value="FULL_TIME" className="text-white bg-gray-700">Full-time</option>
            <option value="PART_TIME" className="text-white bg-gray-700">Part-time</option>
            <option value="CONTRACT" className="text-white bg-gray-700">Contract</option>
            <option value="INTERNSHIP" className="text-white bg-gray-700">Internship</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={experienceLevel}
            onChange={handleExperienceLevelChange}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Experience Level</option>
            <option value="ENTRY" className="text-white bg-gray-700">Entry-level</option>
            <option value="JUNIOR" className="text-white bg-gray-700">Junior</option>
            <option value="MID" className="text-white bg-gray-700">Mid-level</option>
            <option value="SENIOR" className="text-white bg-gray-700">Senior</option>
            <option value="LEAD" className="text-white bg-gray-700">Lead</option>
          </select>
          <select
            value={remoteStatus}
            onChange={handleRemoteStatusChange}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Remote Policy</option>
            <option value="ONSITE" className="text-white bg-gray-700">On-site</option>
            <option value="HYBRID" className="text-white bg-gray-700">Hybrid</option>
            <option value="REMOTE" className="text-white bg-gray-700">Remote</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Min Salary"
            className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            value={salaryMin}
            onChange={handleSalaryMinChange}
          />
          <input
            type="number"
            placeholder="Max Salary"
            className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            value={salaryMax}
            onChange={handleSalaryMaxChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={datePosted}
            onChange={handleDatePostedChange}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Date Posted</option>
            <option value="24h" className="text-white bg-gray-700">Last 24 hours</option>
            <option value="7d" className="text-white bg-gray-700">Last 7 days</option>
            <option value="30d" className="text-white bg-gray-700">Last 30 days</option>
          </select>
          <input
            type="text"
            placeholder="Industry"
            className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            value={industry}
            onChange={handleIndustryChange}
          />
        </div>
        <div className="flex justify-between gap-6 mt-4 text-sm text-gray-400">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-gray-400 hover:text-white"
          >
            Clear Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="date" className="text-white bg-gray-700">Sort by Date</option>
            <option value="salary" className="text-white bg-gray-700">Sort by Salary</option>
          </select>
        </div>      </form>
    </div>
  );
};
export default React.memo(Searchbar);
