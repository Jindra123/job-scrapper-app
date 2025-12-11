import Link from "next/link";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import JobActions from "@/components/JobActions";

interface DashboardJob {
  id: string;
  title: string;
  status: JobStatus;
  createdAt: string;
  applicationCount: number;
}

async function getDashboardData(companyId: string): Promise<DashboardJob[]> {
  const jobs = await prisma.job.findMany({
    where: {
      creatorId: companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const jobIds = jobs.map((job) => job.id);

  const applicationCounts = await prisma.application.groupBy({
    by: ["jobId"],
    where: {
      jobId: {
        in: jobIds,
      },
    },
    _count: {
      id: true,
    },
  });

  const countsMap = new Map<string, number>();
  applicationCounts.forEach((count) => {
    countsMap.set(count.jobId, count._count.id);
  });

  const dashboardJobs = jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    applicationCount: countsMap.get(job.id) || 0,
  }));

  return dashboardJobs;
}

export default async function CompanyDashboardPage() {
  const session = await auth();

  if (!session || session.user?.type !== "company") {
    redirect("/auth/signin");
  }

  const jobs = await getDashboardData(session.user.id);

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

        {jobs.length === 0 ? (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <JobActions jobId={job.id} initialStatus={job.status} />
                    </td>
                    </tr>                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
