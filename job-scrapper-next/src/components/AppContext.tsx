"use client";

import { createContext, useState, useEffect } from "react";
import { Job } from "@/types/Job";

interface AppContextType {
  listOfJobs: Job[];
  setListOfJobs: (listOfJobs: Job[]) => void;
}

const AppContext = createContext<AppContextType>({
  listOfJobs: [],
  setListOfJobs: () => {},
});

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [listOfJobs, setListOfJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem("listOfJobs");
    if (storedJobs && storedJobs !== "[]") {
      try {
        const parsedJobs = JSON.parse(storedJobs);
        if (
          Array.isArray(parsedJobs) &&
          parsedJobs.every((job) => typeof job === "object" && job !== null)
        ) {
          setListOfJobs(parsedJobs as Job[]);
        } else {
          console.warn(
            "Invalid data in localStorage for listOfJobs. Clearing.",
          );
          localStorage.removeItem("listOfJobs");
        }
      } catch (error) {
        console.error("Error parsing listOfJobs from localStorage:", error);
        localStorage.removeItem("listOfJobs");
      }
    } else {
      // If no jobs in localStorage, fetch initial jobs
      const fetchInitialJobs = async () => {
        try {
          const res = await fetch("/api/jobs/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "", source: "all" }),
          });

          if (!res.ok) {
            throw new Error("Initial job fetch failed");
          }

          const data = await res.json();
          setListOfJobs(data.jobs);
        } catch (error) {
          console.error("Error fetching initial jobs:", error);
        }
      };

      fetchInitialJobs();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("listOfJobs", JSON.stringify(listOfJobs));
  }, [listOfJobs]);

  return (
    <AppContext.Provider value={{ listOfJobs, setListOfJobs }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
