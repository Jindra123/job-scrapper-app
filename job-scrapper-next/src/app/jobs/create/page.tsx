"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    employmentType: "",
    remote: false,
    bonuses: "",
    benefits: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to create job");
      }

      router.push("/"); // Redirect to home or job list page
    } catch {
      setError("An error occurred");
    }
  };

  return (
    <AuthLayout
      title="Create Job Offer"
      subheading="Post a New Opportunity"
      footerText="Back to"
      footerLinkText="Sign In"
      footerLinkHref="/auth/signin"
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm text-gray-400">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Job title"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm text-gray-400">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Company name"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm text-gray-400">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Job location"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm text-gray-400">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job description"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="salaryMin" className="block text-sm text-gray-400">
            Salary Min
          </label>
          <input
            id="salaryMin"
            name="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="Minimum salary"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="salaryMax" className="block text-sm text-gray-400">
            Salary Max
          </label>
          <input
            id="salaryMax"
            name="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="Maximum salary"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label
            htmlFor="employmentType"
            className="block text-sm text-gray-400"
          >
            Employment Type
          </label>
          <input
            id="employmentType"
            name="employmentType"
            type="text"
            value={formData.employmentType}
            onChange={handleChange}
            placeholder="e.g., Full-time, Part-time"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div className="flex items-center">
          <input
            id="remote"
            name="remote"
            type="checkbox"
            checked={formData.remote}
            onChange={handleChange}
            className="h-4 w-4 appearance-none border text-purple-500 checked:border-purple-500 hover:border-purple-500 border-white rounded bg-transparent"
          />
          <label htmlFor="remote" className="ml-2 text-sm text-gray-400">
            Remote Job
          </label>
        </div>
        <div>
          <label htmlFor="bonuses" className="block text-sm text-gray-400">
            Bonuses
          </label>
          <input
            id="bonuses"
            name="bonuses"
            type="text"
            value={formData.bonuses}
            onChange={handleChange}
            placeholder="e.g., Sign-on bonus: $5000"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="benefits" className="block text-sm text-gray-400">
            Benefits
          </label>
          <input
            id="benefits"
            name="benefits"
            type="text"
            value={formData.benefits}
            onChange={handleChange}
            placeholder="e.g., Health insurance, 401k"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
        >
          Create Job Offer
        </button>
      </form>
    </AuthLayout>
  );
};

export default CreateJobPage;
