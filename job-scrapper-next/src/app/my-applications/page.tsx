import Link from "next/link";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

// Define interfaces for the data structure
interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface Job {
  id: string;
  title: string;
  creator: Company;
}

interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: Job;
}

async function getApplications(userId: string): Promise<Application[]> {
  const applications = await prisma.application.findMany({
    where: {
      userId,
    },
    include: {
      job: {
        include: {
          creator: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
  return applications as Application[];
}

export default async function MyApplicationsPage() {
  const session = await auth();

  if (!session || session.user?.type !== "user") {
    redirect("/auth/signin");
  }

  const applications = await getApplications(session.user.id);

  const getStatusChipClass = (status: Application["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Toaster />
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-text dark:text-white mb-8">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center dark:bg-gray-800">
            <p className="text-text-light dark:text-gray-300">
              You haven't applied to any jobs yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={app.job.creator.logoUrl || "/placeholder-logo.svg"}
                    alt={`${app.job.creator.name} logo`}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <Link
                      href={`/jobs/${app.job.id}`}
                      className="text-xl font-semibold text-primary hover:underline"
                    >
                      {app.job.title}
                    </Link>
                    <Link href={`/company/${app.job.creator.id}`}>
                      <p className="text-md text-text-light dark:text-gray-300 hover:underline">
                        {app.job.creator.name}
                      </p>
                    </Link>
                    <p className="text-sm text-text-light dark:text-gray-400 mt-1">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusChipClass(
                      app.status,
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
