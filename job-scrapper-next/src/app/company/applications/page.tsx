"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationsTable from "@/components/ApplicationsTable"; // Import the new component
import { Application } from "@/types/Application"; // Import the shared type

export default function CompanyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const jobId = searchParams.get("jobId"); // Extract jobId

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.type !== "company") {
      router.push("/auth/signin");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true); // Set loading true before fetch
        let apiUrl = "/api/company/applications";
        if (jobId) {
          apiUrl += `?jobId=${jobId}`;
        }

        const res = await fetch(apiUrl);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch applications");
        }
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session, status, router, jobId, searchParams]); // Add jobId and searchParams to dependencies

  const handleStatusChange = useCallback(
    async (applicationId: string, newStatus: Application["status"]) => {
      try {
        const res = await fetch(`/api/applications/${applicationId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || "Failed to update application status",
          );
        }

        toast.success("Application status updated successfully!");
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app,
          ),
        );
      } catch (err: any) {
        toast.error(err.message);
        console.error("Error updating application status:", err);
      }
    },
    [],
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-transparent shadow-2xl rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-pink-500 mb-4">
              Error Loading Applications
            </h1>
            <p className="text-red-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Toaster />
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-pink-500 mb-8">
          Job Applications {jobId && `for Job ID: ${jobId}`}
        </h1>

        {applications.length === 0 ? (
          <div className="bg-transparent shadow-2xl rounded-lg p-6 text-center">
            <p className="text-gray-400">
              No applications received for your jobs yet.
            </p>
          </div>
        ) : (
          <ApplicationsTable
            applications={applications}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

