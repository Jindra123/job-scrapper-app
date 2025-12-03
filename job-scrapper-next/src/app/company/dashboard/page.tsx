"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JobStatus } from "@prisma/client";

interface DashboardJob {
  id: string;
  title: string;
  status: JobStatus;
  createdAt: string;
  applicationCount: number;
}

export default function CompanyDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/company/dashboard");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session.user?.type === "company") {
      fetchDashboardData();
    } else if (status === "authenticated" && session.user?.type !== "company") {
      router.push("/");
    }
  }, [session, status, router, fetchDashboardData]);

  const handleToggleStatus = async (jobId: string, currentStatus: JobStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      const { job: updatedJob } = await res.json();
      toast.success("Status updated successfully!", { id: toastId });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: updatedJob.status } : job
        )
      );
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const getStatusChipClass = (status: JobStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Toaster />
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500">Company Dashboard</h1>
          <Link href="/jobs/create">
            <button className="px-4 py-2 border border-solid border-green-500/[.8] text-white transition-colors hover:bg-green-200 hover:text-green-900 rounded-full">
              + Post New Job
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {!error && jobs.length === 0 ? (
          <div className="bg-transparent shadow-2xl rounded-lg p-8 text-center">
            <p className="text-gray-400">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-transparent shadow-2xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applications</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Posted</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{job.applicationCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link href={`/company/applications?jobId=${job.id}`} className="text-blue-400 hover:underline">View</Link>
                      <Link href={`/jobs/edit/${job.id}`} className="text-purple-400 hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="text-red-400 hover:underline"
                      >
                        {job.status === 'CLOSED' ? 'Re-open' : 'Close'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
