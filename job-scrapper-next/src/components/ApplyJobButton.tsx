"use client";

import { useState, useCallback, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ApplyJobButtonProps {
  jobId: string;
  initialHasApplied: boolean;
}

export default function ApplyJobButton({ jobId, initialHasApplied }: ApplyJobButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isPending, startTransition] = useTransition();

  const isUser = session?.user?.type === "user";
  const isAuthenticated = status === "authenticated";

  const handleApply = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs.");
      router.push("/auth/signin");
      return;
    }

    if (!isUser) {
      toast.error("Only job seekers can apply for jobs.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          toast.success("Application submitted successfully!");
          setHasApplied(true);
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to submit application.");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
        console.error("Application submission error:", error);
      }
    });
  }, [isAuthenticated, isUser, jobId, router]);

  const getButtonClass = () => {
    if (!isAuthenticated || !isUser || hasApplied || isPending) {
      return "bg-secondary text-text-light cursor-not-allowed dark:bg-gray-700 dark:text-gray-400";
    }
    return "bg-primary text-white hover:bg-primary-light";
  }

  const getButtonContent = () => {
    if (!isAuthenticated) return "Login to Apply";
    if (!isUser) return "Only Job Seekers Can Apply";
    if (hasApplied) return "Applied!";
    if (isPending) return "Applying...";
    return "Apply Now";
  }

  return (
    <button
      onClick={handleApply}
      disabled={!isAuthenticated || !isUser || hasApplied || isPending}
      className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${getButtonClass()}`}
    >
      {getButtonContent()}
    </button>
  );
}
