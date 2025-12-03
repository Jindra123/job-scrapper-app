"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ApplyJobButtonProps {
  jobId: string;
}

export default function ApplyJobButton({ jobId }: ApplyJobButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const isUser = session?.user?.type === "user";
  const isAuthenticated = status === "authenticated";

  // Check if the user has already applied for this job
  useEffect(() => {
    if (isAuthenticated && isUser && jobId) {
      const checkIfApplied = async () => {
        try {
          const res = await fetch(`/api/user/applications/${jobId}`);
          if (res.ok) {
            const data = await res.json();
            setHasApplied(data.applied);
          }
        } catch (error) {
          console.error("Failed to check application status:", error);
        }
      };
      checkIfApplied();
    }
  }, [isAuthenticated, isUser, jobId]);

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

    setIsApplying(true);
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
    } finally {
      setIsApplying(false);
    }
  }, [isAuthenticated, isUser, jobId, router]);

  let buttonContent;
  let buttonDisabled = false;
  let buttonClass =
    "mt-6 block w-full text-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ";

  if (!isAuthenticated) {
    buttonContent = "Login to Apply";
    buttonClass += "bg-gray-500 cursor-not-allowed";
    buttonDisabled = true;
  } else if (!isUser) {
    buttonContent = "Only Job Seekers Can Apply";
    buttonClass += "bg-gray-500 cursor-not-allowed";
    buttonDisabled = true;
  } else if (hasApplied) {
    buttonContent = "Applied!";
    buttonClass += "bg-green-600 cursor-not-allowed";
    buttonDisabled = true;
  } else if (isApplying) {
    buttonContent = "Applying...";
    buttonClass += "bg-pink-400 cursor-not-allowed";
    buttonDisabled = true;
  } else {
    buttonContent = "Apply Now";
    buttonClass += "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500";
  }

  return (
    <button
      onClick={handleApply}
      disabled={buttonDisabled}
      className={buttonClass}
    >
      {buttonContent}
    </button>
  );
}
