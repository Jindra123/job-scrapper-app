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
  fetchJobs: (
    query?: string,
    loc?: string,
    empType?: string,
    remStatus?: RemoteStatus | "",
    expLevel?: string,
    source?: string,
  ) => Promise<void>;
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

  const fetchJobs = useCallback(
    async (
      query = "",
      loc = "",
      empType = "",
      remStatus: RemoteStatus | "" = "",
      expLevel = "",
      source = "all",
    ) => {
      try {
        const res = await fetch("/api/jobs/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            location: loc,
            employmentType: empType,
            remoteStatus: remStatus,
            experienceLevel: expLevel,
            source,
          }),
        });

        if (!res.ok) {
          throw new Error("Job fetch failed");
        }

        const data = await res.json();
        setListOfJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    },
    [],
  );

  useEffect(() => {
    // If no jobs in localStorage, fetch initial jobs
    if (!localStorage.getItem("listOfJobs") || localStorage.getItem("listOfJobs") === "[]") {
      fetchJobs();
    } else {
      try {
        const storedJobs = JSON.parse(localStorage.getItem("listOfJobs") || "[]");
        if (Array.isArray(storedJobs) && storedJobs.every((job) => typeof job === "object" && job !== null)) {
          setListOfJobs(storedJobs as Job[]);
        } else {
          console.warn("Invalid data in localStorage for listOfJobs. Clearing.");
          localStorage.removeItem("listOfJobs");
          fetchJobs();
        }
      } catch (error) {
        console.error("Error parsing listOfJobs from localStorage:", error);
        localStorage.removeItem("listOfJobs");
        fetchJobs();
      }
    }
  }, [fetchJobs]);

  useEffect(() => {
    localStorage.setItem("listOfJobs", JSON.stringify(listOfJobs));
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
        fetchJobs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
