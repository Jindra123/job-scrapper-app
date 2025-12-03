import { useContext, useEffect } from "react";
import AppContext from "@/components/AppContext";
import { RemoteStatus } from "@prisma/client";

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
    sourceFilter,
    setSourceFilter,
    fetchJobs,
  } = useContext(AppContext);

  useEffect(() => {
    fetchJobs(searchQuery, location, employmentType, remoteStatus, experienceLevel, sourceFilter);
  }, [fetchJobs, searchQuery, location, employmentType, remoteStatus, experienceLevel, sourceFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchQuery, location, employmentType, remoteStatus, experienceLevel, sourceFilter);
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
            className="w-full bg-transparent text-white placeholder-gray-400 border rounded-md border-pink-600 px-4 py-2 focus:outline-none"
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

        {/* Filters */}
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
            <option value="FULL_TIME" className="text-white bg-gray-700">Full-time</option>
            <option value="PART_TIME" className="text-white bg-gray-700">Part-time</option>
            <option value="CONTRACT" className="text-white bg-gray-700">Contract</option>
            <option value="INTERNSHIP" className="text-white bg-gray-700">Internship</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
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
            onChange={(e) => setRemoteStatus(e.target.value as RemoteStatus | "")}
            className="w-full bg-transparent text-white px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="" className="text-gray-400">Remote Policy</option>
            <option value="ONSITE" className="text-white bg-gray-700">On-site</option>
            <option value="HYBRID" className="text-white bg-gray-700">Hybrid</option>
            <option value="REMOTE" className="text-white bg-gray-700">Remote</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
          {/* ... radio buttons ... */}
        </div>
      </form>
    </div>
  );
};
export default Searchbar;
