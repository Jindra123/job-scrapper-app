import { create } from 'zustand';
import { Job } from '@/types/Job';
import { RemoteStatus } from '@prisma/client';

interface JobStore {
  listOfJobs: Job[];
  location: string;
  employmentType: string;
  remoteStatus: RemoteStatus | '';
  experienceLevel: string;
  searchQuery: string;
  sourceFilter: string;
  currentPage: number;
  totalPages: number;
  isPending: boolean;
  salaryMin: string;
  salaryMax: string;
  datePosted: string;
  industry: string;
  sortBy: string;
  setListOfJobs: (jobs: Job[]) => void;
  setLocation: (location: string) => void;
  setEmploymentType: (employmentType: string) => void;
  setRemoteStatus: (remoteStatus: RemoteStatus | '') => void;
  setExperienceLevel: (experienceLevel: string) => void;
  setSearchQuery: (query: string) => void;
  setSourceFilter: (source: string) => void;
  setCurrentPage: (page: number) => void;
  setIsPending: (isPending: boolean) => void;
  setSalaryMin: (salaryMin: string) => void;
  setSalaryMax: (salaryMax: string) => void;
  setDatePosted: (datePosted: string) => void;
  setIndustry: (industry: string) => void;
  setSortBy: (sortBy: string) => void;
  clearFilters: () => void;
  fetchJobs: (page?: number) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  listOfJobs: [],
  location: '',
  employmentType: '',
  remoteStatus: '',
  experienceLevel: '',
  searchQuery: '',
  sourceFilter: 'all',
  currentPage: 1,
  totalPages: 1,
  isPending: false,
  salaryMin: '',
  salaryMax: '',
  datePosted: '',
  industry: '',
  sortBy: 'date',
  setListOfJobs: (jobs) => set({ listOfJobs: jobs }),
  setLocation: (location) => set({ location }),
  setEmploymentType: (employmentType) => set({ employmentType }),
  setRemoteStatus: (remoteStatus) => set({ remoteStatus }),
  setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsPending: (isPending) => set({ isPending }),
  setSalaryMin: (salaryMin) => set({ salaryMin }),
  setSalaryMax: (salaryMax) => set({ salaryMax }),
  setDatePosted: (datePosted) => set({ datePosted }),
  setIndustry: (industry) => set({ industry }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearFilters: () =>
    set({
      location: '',
      employmentType: '',
      remoteStatus: '',
      experienceLevel: '',
      searchQuery: '',
      salaryMin: '',
      salaryMax: '',
      datePosted: '',
      industry: '',
    }),
  fetchJobs: async (page = 1) => {
    const {
      searchQuery,
      location,
      employmentType,
      remoteStatus,
      experienceLevel,
      sourceFilter,
      salaryMin,
      salaryMax,
      datePosted,
      industry,
      sortBy,
      setIsPending,
    } = get();

    setIsPending(true);
    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location,
          employmentType,
          remoteStatus,
          experienceLevel,
          source: sourceFilter,
          page,
          pageSize: 10,
          salaryMin,
          salaryMax,
          datePosted,
          industry,
          sortBy,
        }),
      });

      if (!res.ok) {
        throw new Error('Job fetch failed');
      }

      const data = await res.json();
      set({
        listOfJobs: data.jobs,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsPending(false);
    }
  },
}));
