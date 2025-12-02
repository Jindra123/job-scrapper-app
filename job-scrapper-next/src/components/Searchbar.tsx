"use client";

import { useContext, useState } from "react";
import AppContext from "@/components/AppContext";

const Searchbar = () => {
  const [query, setQuery] = useState({ name: "" });
  const [sourceFilter, setSourceFilter] = useState("all"); // "all", "website", "scraped"
  const { setListOfJobs } = useContext(AppContext);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.name, source: sourceFilter }),
      });

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();
      setListOfJobs(data.jobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
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
        className="bg-transparent shadow-2xl rounded-full p-2"
      >
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for a job title, company, or keyword..."
            className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none"
            value={query.name}
            onChange={(e) => setQuery({ name: e.target.value })}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white rounded-full px-6 py-2 hover:bg-pink-700 transition-colors duration-300"
          >
            Search
          </button>
        </div>
      </form>
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
    </div>
  );
};
export default Searchbar;
