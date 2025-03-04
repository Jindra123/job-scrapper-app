"use client";

import Image from "next/image";
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
    <div className="max-w-md mx-auto mt-10">
      <Image
        className="dark:invert mx-auto"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <form onSubmit={handleSearch} className="mt-8 space-y-4">
        <div className="flex px-4 py-3 rounded-md border-2 border-[#f2f2f2] overflow-hidden">
          <input
            type="text"
            placeholder="Search Something..."
            className="w-full outline-none bg-transparent text-[#f2f2f2] text-sm rounded-full"
            value={query.name}
            onChange={(e) => setQuery({ name: e.target.value })}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-[#f2f2f2]"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </div>
        <div className="flex gap-4 justify-center text-sm text-gray-400">
          <label className="flex items-center">
            <input
              type="radio"
              name="source"
              value="all"
              checked={sourceFilter === "all"}
              onChange={() => setSourceFilter("all")}
              className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-700"
            />
            All Jobs
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="source"
              value="website"
              checked={sourceFilter === "website"}
              onChange={() => setSourceFilter("website")}
              className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-700"
            />
            Website Jobs
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="source"
              value="scraped"
              checked={sourceFilter === "scraped"}
              onChange={() => setSourceFilter("scraped")}
              className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-700"
            />
            Scraped Jobs
          </label>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 border border-solid border-orange-500/[.8] text-white transition-colors hover:bg-orange-200 hover:text-orange-900 rounded-full"
        >
          Search
        </button>
      </form>
    </div>
  );
};
export default Searchbar;
