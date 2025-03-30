import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Link }from "@heroui/react";
import Image from "next/image";

const prisma = new PrismaClient();

interface JobDetailPageProps {
  params: { id: string };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!job) {
    notFound();
  }

  // Placeholder for company logo (replace with actual URL or fetch logic)
  const logoUrl = "/placeholder-logo.png"; // Add a static logo or fetch from job.company

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto p-6">
        {/* Back Link */}
        <Link
          href="/"
          className="text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pink-500 flex items-center">
              {job.title}
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              {job.salaryMin && job.salaryMax
                ? `${job.salaryMin} - ${job.salaryMax} ${job.currency}`
                : "Salary TBD"}{" "}
              • {job.experience || "Experience TBD"} • Posted:{" "}
              {job.postedDate?.toDateString() || "N/A"}
            </p>
          </div>
          <div className="w-1/4 text-right">
            <Image
              src={logoUrl}
              alt={`${job.company} logo`}
              width={100}
              height={100}
              className="rounded-full object-contain"
            />
            <p className="text-xl font-semibold text-gray-200 mt-2">
              {job.company}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Description */}
          <div className="col-span-2">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                About the Job
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {job.description ||
                  "Hello! We’re looking for a passionate individual to join our dynamic team. This role offers a chance to make an impact every day while working in a supportive environment."}
              </p>
            </section>

            {/* Additional Details */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Details
              </h2>
              <div className="space-y-2 text-gray-400">
                {job.requirements && (
                  <p>
                    <strong className="text-gray-200">Requirements:</strong>{" "}
                    {job.requirements}
                  </p>
                )}
                {job.responsibilities && (
                  <p>
                    <strong className="text-gray-200">Responsibilities:</strong>{" "}
                    {job.responsibilities}
                  </p>
                )}
                {job.bonuses && (
                  <p>
                    <strong className="text-gray-200">Bonuses:</strong>{" "}
                    {job.bonuses}
                  </p>
                )}
                {job.benefits && (
                  <p>
                    <strong className="text-gray-200">Benefits:</strong>{" "}
                    {job.benefits}
                  </p>
                )}
              </div>
            </section>

            {job.skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1">
            <section className="bg-transparent p-4  rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">
                Job Overview
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  <strong className="text-gray-200">Location:</strong>{" "}
                  {job.location || "Remote"}
                </p>
                <p>
                  <strong className="text-gray-200">Type:</strong>{" "}
                  {job.employmentType || "Full-time"}
                </p>
                <p>
                  <strong className="text-gray-200">Remote:</strong>{" "}
                  {job.remote ? "Yes" : "No"}
                </p>
                <p>
                  <strong className="text-gray-200">Expires:</strong>{" "}
                  {job.expiresDate?.toDateString() || "N/A"}
                </p>
                <p>
                  <strong className="text-gray-200">Source:</strong>{" "}
                  {job.source || "Website"}
                </p>
              </div>
              <Link
                href={job.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition text-center block"
              >
                Apply Now
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  return {
    title: job?.title || "Job Not Found",
    description: job?.description || "Job details",
  };
}
