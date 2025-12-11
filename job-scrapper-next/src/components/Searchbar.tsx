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
    sortBy,
    setSortBy,
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
    <div className="w-full max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-center text-text dark:text-white mb-2">
        Find Your Next Opportunity
      </h1>
      <p className="text-center text-text-light dark:text-gray-300 mb-8">
        Search for jobs from all over the web.
      </p>
      <form
        onSubmit={handleSearch}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by title, company, or keyword..."
            className="w-full px-4 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-primary rounded-md hover:bg-primary-light transition-colors"
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Location (e.g., 'Prague')"
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={location}
            onChange={handleLocationChange}
          />
          <select
            value={employmentType}
            onChange={handleEmploymentTypeChange}
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Employment Type</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          <select
            value={experienceLevel}
            onChange={handleExperienceLevelChange}
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Experience Level</option>
            <option value="ENTRY">Entry-level</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid-level</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
          </select>
          <select
            value={remoteStatus}
            onChange={handleRemoteStatusChange}
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Remote Policy</option>
            <option value="ONSITE">On-site</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
          <input
            type="number"
            placeholder="Min Salary"
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={salaryMin}
            onChange={handleSalaryMinChange}
          />
          <input
            type="number"
            placeholder="Max Salary"
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={salaryMax}
            onChange={handleSalaryMaxChange}
          />
          <select
            value={datePosted}
            onChange={handleDatePostedChange}
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Date Posted</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <input
            type="text"
            placeholder="Industry"
            className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={industry}
            onChange={handleIndustryChange}
          />
        </div>
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-text-light hover:text-text dark:text-gray-300 dark:hover:text-white"
          >
            Clear Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="salary">Sort by Salary</option>
          </select>
        </div>
      </form>
    </div>
  );
};
export default React.memo(Searchbar);
