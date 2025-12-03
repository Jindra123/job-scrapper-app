"use client";

import { AppProvider } from "@/components/AppContext";
import Searchbar from "@/components/Searchbar";
import JobsScrollGrid from "@/components/JobsScrollGrid";

const JobSearch = () => {
  return (
    <AppProvider>
      <Searchbar />
      <JobsScrollGrid />
    </AppProvider>
  );
};

export default JobSearch;
