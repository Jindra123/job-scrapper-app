"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
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

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>
        <div className="bg-transparent shadow-2xl rounded-lg overflow-hidden mt-10">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-pink-500 text-center">
              Create a New Job Offer
            </h1>
            <p className="text-sm text-gray-400 text-center mb-8">
              Fill in the details below to post a new job opportunity.
            </p>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md my-4">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Job Title"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Location (e.g., 'San Francisco, CA')"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job Description"
                rows={5}
                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="Minimum Salary"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                <input
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="Maximum Salary"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <input
                name="employmentType"
                type="text"
                value={formData.employmentType}
                onChange={handleChange}
                placeholder="Employment Type (e.g., Full-time, Contract)"
                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="bonuses"
                  type="text"
                  value={formData.bonuses}
                  onChange={handleChange}
                  placeholder="Bonuses (e.g., Sign-on bonus)"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                <input
                  name="benefits"
                  type="text"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Benefits (e.g., Health Insurance)"
                  className="px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  checked={formData.remote}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 bg-transparent border-gray-600 rounded focus:ring-pink-500"
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-400">
                  This is a remote position
                </label>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Create Job Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateJobPage;
