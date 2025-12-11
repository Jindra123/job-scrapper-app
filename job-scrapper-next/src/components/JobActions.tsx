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
  const [isDeleting, setIsDeleting] = useState(false);


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
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/company/applications?jobId=${jobId}`} className="text-primary hover:underline dark:text-primary-light">View</Link>
      <Link href={`/jobs/edit/${jobId}`} className="text-primary hover:underline dark:text-primary-light">Edit</Link>
      <button
        onClick={handleToggleStatus}
        className="text-primary hover:underline dark:text-primary-light"
        disabled={isPending}
      >
        {isPending ? "Updating..." : status === "CLOSED" ? "Re-open" : "Close"}
      </button>
      <button
        onClick={handleDelete}
        className="text-destructive hover:underline dark:text-destructive-light"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
