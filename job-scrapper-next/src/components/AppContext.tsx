"use client";

import { createContext, useState, useEffect } from "react";
import { JobListingCardProps } from "@/components/JobListingCard";

interface AppContextType {
  listOfJobs: JobListingCardProps[];
  setListOfJobs: (listOfJobs: JobListingCardProps[]) => void;
}

const AppContext = createContext<AppContextType>({
  listOfJobs: [],
  setListOfJobs: () => {},
});

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [listOfJobs, setListOfJobs] = useState<JobListingCardProps[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem("listOfJobs");
    if (storedJobs) {
      try {
        const parsedJobs = JSON.parse(storedJobs);

        // Type check before setting the state to avoid potential issues
        if (
          Array.isArray(parsedJobs) &&
          parsedJobs.every((job) => typeof job === "object" && job !== null)
        ) {
          setListOfJobs(parsedJobs as JobListingCardProps[]);
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
