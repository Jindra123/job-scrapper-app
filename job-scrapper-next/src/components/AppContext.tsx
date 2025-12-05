"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { Job } from "@/types/Job";
import { RemoteStatus } from "@prisma/client";

interface AppContextType {
  listOfJobs: Job[];
  setListOfJobs: (listOfJobs: Job[]) => void;
  location: string;
  setLocation: (location: string) => void;
  employmentType: string;
  setEmploymentType: (employmentType: string) => void;
  remoteStatus: RemoteStatus | "";
  setRemoteStatus: (remoteStatus: RemoteStatus | "") => void;
  experienceLevel: string;
  setExperienceLevel: (experienceLevel: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sourceFilter: string;
  setSourceFilter: (source: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  fetchJobs: (page?: number) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  listOfJobs: [],
  setListOfJobs: () => {},
  location: "",
  setLocation: () => {},
  employmentType: "",
  setEmploymentType: () => {},
  remoteStatus: "",
  setRemoteStatus: () => {},
  experienceLevel: "",
  setExperienceLevel: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  sourceFilter: "all",
  setSourceFilter: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  totalPages: 1,
  fetchJobs: async () => {},
});

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [listOfJobs, setListOfJobs] = useState<Job[]>([]);
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus | "">("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(
    async (page: number = 1) => {
      try {
        const res = await fetch("/api/jobs/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            location: location,
            employmentType: employmentType,
            remoteStatus: remoteStatus,
            experienceLevel: experienceLevel,
            source: sourceFilter,
            page,
            pageSize: 10,
          }),
        });

        if (!res.ok) {
          throw new Error("Job fetch failed");
        }

        const data = await res.json();
        setListOfJobs(data.jobs);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    },
    [searchQuery, location, employmentType, remoteStatus, experienceLevel, sourceFilter],
  );

  useEffect(() => {
    fetchJobs(1); // Fetch the first page on initial load or when filters change
  }, [fetchJobs]); // The dependency array now correctly re-fetches when filters change

  useEffect(() => {
    // This effect is probably not needed anymore if we fetch on every filter change
    // but we can keep it for now as a fallback or for other purposes.
    // localStorage.setItem("listOfJobs", JSON.stringify(listOfJobs));
  }, [listOfJobs]);

  return (
    <AppContext.Provider
      value={{
        listOfJobs,
        setListOfJobs,
        location,
        setLocation,
        employmentType,
        setEmploymentType,
        remoteStatus,
        setRemoteStatus,
        experienceLevel,
        setExperienceLevel,
        searchQuery,
        setSearchQuery,
        sourceFilter,
        setSourceFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        fetchJobs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
