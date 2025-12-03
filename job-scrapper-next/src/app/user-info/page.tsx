"use client";

import { useReducer, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 1. Define State and Action types
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

interface PageState {
  profile: UserProfile;
  resumeFile: File | null;
  isLoading: boolean;
  error: string | null;
}

type PageAction =
  | { type: "SET_FIELD"; field: keyof UserProfile; value: string }
  | { type: "SET_RESUME_FILE"; file: File | null }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: UserProfile }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; payload: UserProfile }
  | { type: "SUBMIT_ERROR"; payload: string };

// 2. Define the reducer function
const pageReducer = (state: PageState, action: PageAction): PageState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        profile: { ...state.profile, [action.field]: action.value },
      };
    case "SET_RESUME_FILE":
      return { ...state, resumeFile: action.file };
    case "FETCH_START":
    case "SUBMIT_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, profile: action.payload };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
        resumeFile: null,
      };
    case "FETCH_ERROR":
    case "SUBMIT_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// 3. Define the initial state
const initialState: PageState = {
  profile: {},
  resumeFile: null,
  isLoading: true,
  error: null,
};

export default function UserInfoPage() {
  const { status } = useSession();
  const router = useRouter();

  // 4. Use the useReducer hook
  const [state, dispatch] = useReducer(pageReducer, initialState);
  const { profile, resumeFile, isLoading, error } = state;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      const fetchProfile = async () => {
        dispatch({ type: "FETCH_START" });
        try {
          const res = await fetch("/api/user/profile");
          if (!res.ok) throw new Error("Failed to fetch profile data.");
          const data = await res.json();
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (err: any) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      };
      fetchProfile();
    }
  }, [status, router]);

  // 5. Update event handlers to dispatch actions
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_FIELD",
      field: name as keyof UserProfile,
      value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    dispatch({ type: "SET_RESUME_FILE", file });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });

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
      dispatch({ type: "SUBMIT_SUCCESS", payload: data.user });
      alert("Profile updated successfully!");
    } catch (err: any) {
      dispatch({ type: "SUBMIT_ERROR", payload: err.message });
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-red-500 text-center mt-10">
            <p>Error: {error}</p>
            <p>Please try reloading the page or submitting the form again.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="flex items-center space-x-5">
              <Image
                src={profile.image || "/placeholder-logo.svg"}
                alt="user image"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-pink-500">
                  {profile.name || "Your Profile"}
                </h1>
                <p className="text-sm text-gray-400">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-300"
                >
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={profile.summary || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-300"
                >
                  Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="resume"
                        className="relative cursor-pointer bg-transparent rounded-md font-medium text-pink-500 hover:text-pink-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF up to 10MB
                    </p>
                  </div>
                </div>
                {resumeFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Selected file: {resumeFile.name}
                  </p>
                )}
                {profile.resumeUrl && !resumeFile && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm mt-2 block"
                  >
                    View Current Resume
                  </a>
                )}
              </div>

              <div className="pt-6">
                <h2 className="text-lg font-semibold text-pink-500">
                  Portfolio Links
                </h2>
                <div className="space-y-4 mt-4">
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={profile.linkedinUrl || ""}
                    onChange={handleInputChange}
                    placeholder="LinkedIn URL"
                    className="block w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                  <input
                    type="url"
                    name="githubUrl"
                    value={profile.githubUrl || ""}
                    onChange={handleInputChange}
                    placeholder="GitHub URL"
                    className="block w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                  <input
                    type="url"
                    name="websiteUrl"
                    value={profile.websiteUrl || ""}
                    onChange={handleInputChange}
                    placeholder="Personal Website URL"
                    className="block w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}