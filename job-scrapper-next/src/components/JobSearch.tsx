"use client";

import { useEffect } from "react";
import Searchbar from "@/components/Searchbar";
import JobsScrollGrid from "@/components/JobsScrollGrid";
import { useJobStore } from "@/store/job-store";

const JobSearch = () => {
  const fetchJobs = useJobStore((state) => state.fetchJobs);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  return (
    <>
      <Searchbar />
      <JobsScrollGrid />
    </>
  );
};

export default JobSearch;
