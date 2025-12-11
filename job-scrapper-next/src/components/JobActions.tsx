"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { JobStatus } from "@prisma/client";
import Link from "next/link";

interface JobActionsProps {
  jobId: string;
  initialStatus: JobStatus;
}

export default function JobActions({ jobId, initialStatus }: JobActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = async () => {
    startTransition(async () => {
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
        setStatus(updatedJob.status);
        toast.success("Status updated successfully!", { id: toastId });
        router.refresh();
      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      }
    });
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting job...");
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete job");
      }

      toast.success("Job deleted successfully!", { id: toastId });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="space-x-2">
      <Link href={`/company/applications?jobId=${jobId}`} className="text-blue-400 hover:underline">View</Link>
      <Link href={`/jobs/edit/${jobId}`} className="text-purple-400 hover:underline">Edit</Link>
      <button
        onClick={handleToggleStatus}
        className="text-red-400 hover:underline"
        disabled={isPending}
      >
        {isPending ? "Updating..." : status === "CLOSED" ? "Re-open" : "Close"}
      </button>
      <button
        onClick={handleDelete}
        className="text-red-400 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
