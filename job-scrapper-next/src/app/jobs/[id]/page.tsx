import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplyJobButton from "@/components/ApplyJobButton";
import { auth } from "@/auth"; // Import server-side auth helper

const prisma = new PrismaClient();

interface JobDetailPageProps {
  params: { id: string };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
    notFound();
  }

  const session = await auth(); // Get session on the server

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { creator: true },
  });

  if (!job) {
    notFound();
  }

  const companyLogo = job.creator?.logoUrl || "/placeholder-logo.svg";

  // @ts-ignore
  const isOwner = session?.user?.type === "company" && session?.user?.id === job.creatorId;

  return (
    <div className="min-h-screen text-white">
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

        <div className="bg-transparent shadow-2xl rounded-lg overflow-hidden mt-10">
          <div className="p-6 md:flex md:items-center md:space-x-6">
            <div className="md:flex-shrink-0">
              <Image
                src={companyLogo}
                alt={`${job.creator.name} logo`}
                width={100}
                height={100}
                className="rounded-full object-contain mx-auto"
              />
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl font-bold text-pink-500">{job.title}</h1>
              <Link href={`/company/${job.creator.id}`}>
                <p className="text-xl font-semibold text-gray-300 hover:underline">
                  {job.creator.name}
                </p>
              </Link>
              <p className="text-md text-gray-400 mt-2">
                {job.salaryMin && job.salaryMax
                  ? `${job.salaryMin} - ${job.salaryMax} ${job.currency}`
                  : "Salary not specified"}{" "}
                | {job.experience || "N/A"} |{" "}
                {job.postedDate?.toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 bg-transparent shadow-2xl rounded-lg p-6">
            <section>
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Job Description
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {job.description || "No description provided."}
              </p>
            </section>
            <section className="mt-6">
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Requirements
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {job.requirements || "No requirements listed."}
              </p>
            </section>
            {job.skills.length > 0 && (
              <section className="mt-6">
                <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="md:col-span-1">
            <div className="bg-transparent shadow-2xl rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">
                Job Overview
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Type:</strong> {job.employmentType || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {job.experience || "N/A"}
                </p>
                <p>
                  <strong>Remote:</strong> {job.remoteStatus || "N/A"}
                </p>
                <p>
                  <strong>Sponsorship:</strong> {job.sponsorshipAvailable ? "Available" : "Not Available"}
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {isOwner ? (
                  <Link
                    href={`/jobs/edit/${job.id}`}
                    className="block w-full text-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Job
                  </Link>
                ) : (
                  <ApplyJobButton jobId={job.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
    return {
      title: "Job Not Found",
      description: "The requested job could not be found.",
    };
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { creator: true },
  });

  return {
    title: `${job?.title || "Job Details"} at ${job?.creator.name || "a company"}`,
    description: job?.description?.slice(0, 150) || "View job details.",
  };
}
