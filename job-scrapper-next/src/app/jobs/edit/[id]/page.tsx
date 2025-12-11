import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import prisma from "@/lib/prisma";
import EditJobForm from "@/components/EditJobForm";
import { Job } from "@prisma/client";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const jobId = params.id;

  if (!session || session.user?.type !== "company") {
    notFound();
  }

  const job = (await prisma.job.findUnique({
    where: { id: jobId },
  })) as Job;

  if (!job || job.creatorId !== session.user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen text-white">
      <Toaster />
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href={`/jobs/${jobId}`}
            className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
          >
            ← Back to Job Details
          </Link>
        </div>
        <EditJobForm job={job} />
      </main>
      <Footer />
    </div>
  );
}
