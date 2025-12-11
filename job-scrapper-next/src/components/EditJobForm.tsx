"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import {
  Job,
  EmploymentType,
  ExperienceLevel,
  RemoteStatus,
} from "@prisma/client";

type JobFormData = Partial<Job>;

interface EditJobFormProps {
  job: Job;
}

export default function EditJobForm({ job: initialJob }: EditJobFormProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobFormData>(initialJob);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setJob((prev) =>
      prev ? { ...prev, [name]: type === "checkbox" ? checked : value } : null,
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!job) return;

    const toastId = toast.loading("Updating job offer...");

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...job,
          salaryMin: job.salaryMin ? parseFloat(String(job.salaryMin)) : null,
          salaryMax: job.salaryMax ? parseFloat(String(job.salaryMax)) : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update job");
      }

      toast.success("Job updated successfully!", { id: toastId });
      router.push(`/jobs/${job.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", {
        id: toastId,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-text text-center dark:text-white">
        Edit Job Offer
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="title" type="text" value={job.title || ""} onChange={handleChange} required placeholder="Job Title" className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
          <input name="location" type="text" value={job.location || ""} onChange={handleChange} required placeholder="Location" className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
        </div>
        <textarea name="description" value={job.description || ""} onChange={handleChange} placeholder="Job Description" rows={5} className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="salaryMin" type="number" value={job.salaryMin || ""} onChange={handleChange} placeholder="Minimum Salary" className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
          <input name="salaryMax" type="number" value={job.salaryMax || ""} onChange={handleChange} placeholder="Maximum Salary" className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select name="employmentType" value={job.employmentType || ""} onChange={handleChange} required className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Select Employment Type</option>
            {Object.values(EmploymentType).map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select name="experience" value={job.experience || ""} onChange={handleChange} required className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Select Experience Level</option>
            {Object.values(ExperienceLevel).map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-light dark:text-gray-300">Remote Policy</label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {Object.values(RemoteStatus).map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input type="radio" name="remoteStatus" value={status} checked={job.remoteStatus === status} onChange={handleChange} className="h-4 w-4 text-primary bg-secondary border-secondary-dark focus:ring-primary" />
                <span className="ml-2 text-text-light dark:text-gray-300">{status}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <input id="sponsorshipAvailable" name="sponsorshipAvailable" type="checkbox" checked={job.sponsorshipAvailable || false} onChange={handleChange} className="h-4 w-4 text-primary bg-secondary border-secondary-dark rounded focus:ring-primary" />
          <label htmlFor="sponsorshipAvailable" className="ml-2 block text-sm text-text-light dark:text-gray-300">Visa Sponsorship Available</label>
        </div>
        <div className="pt-5">
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
