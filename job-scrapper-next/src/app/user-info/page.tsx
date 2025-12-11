"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster, toast } from "react-hot-toast";

interface UserProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  summary?: string | null;
  resumeUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

export default function UserInfoPage() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const res = await fetch("/api/user/profile");
          if (!res.ok) throw new Error("Failed to fetch profile data.");
          const data = await res.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [status, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setResumeFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile.");
      const data = await res.json();
      setProfile(data.user);
      setResumeFile(null);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-destructive text-center mt-10">
            <p>Error: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Toaster />
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 dark:bg-gray-800">
          <div className="flex items-center space-x-5">
            <Image
              src={profile.image || "/placeholder-logo.svg"}
              alt="user image"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-text dark:text-white">
                {profile.name || "Your Profile"}
              </h1>
              <p className="text-sm text-text-light dark:text-gray-300">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-secondary border border-secondary-dark rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-text-light dark:text-gray-300">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={profile.summary || ""}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-secondary border border-secondary-dark rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-text-light dark:text-gray-300">
                Resume (PDF)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-dark border-dashed rounded-md dark:border-gray-600">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-text-light" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-text-light dark:text-gray-300">
                    <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary dark:bg-gray-800">
                      <span>Upload a file</span>
                      <input id="resume" name="resume" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-text-light dark:text-gray-400">PDF up to 10MB</p>
                </div>
              </div>
              {resumeFile && (
                <p className="text-sm text-text-light dark:text-gray-300 mt-2">
                  Selected file: {resumeFile.name}
                </p>
              )}
              {profile.resumeUrl && !resumeFile && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-2 block"
                >
                  View Current Resume
                </a>
              )}
            </div>

            <div className="pt-6">
              <h2 className="text-lg font-semibold text-text dark:text-white">
                Portfolio Links
              </h2>
              <div className="space-y-4 mt-4">
                <input
                  type="url"
                  name="linkedinUrl"
                  value={profile.linkedinUrl || ""}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                  className="block w-full px-3 py-2 bg-secondary border border-secondary-dark rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <input
                  type="url"
                  name="githubUrl"
                  value={profile.githubUrl || ""}
                  onChange={handleInputChange}
                  placeholder="GitHub URL"
                  className="block w-full px-3 py-2 bg-secondary border border-secondary-dark rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <input
                  type="url"
                  name="websiteUrl"
                  value={profile.websiteUrl || ""}
                  onChange={handleInputChange}
                  placeholder="Personal Website URL"
                  className="block w-full px-3 py-2 bg-secondary border border-secondary-dark rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-secondary disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}