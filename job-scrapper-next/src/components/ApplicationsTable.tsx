"use client";

import Link from "next/link";
import { Application } from "@/types/Application"; // I'll need to create this type definition

interface ApplicationsTableProps {
  applications: Application[];
  onStatusChange: (
    applicationId: string,
    newStatus: Application["status"],
  ) => void;
}

export default function ApplicationsTable({
  applications,
  onStatusChange,
}: ApplicationsTableProps) {
  return (
    <div className="overflow-x-auto bg-transparent shadow-2xl rounded-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Applicant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Job Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Applied On
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Resume
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-800 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {app.user.name} ({app.user.email})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <Link
                  href={`/jobs/${app.job.id}`}
                  className="text-pink-500 hover:underline"
                >
                  {app.job.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {new Date(app.appliedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {app.user.resumeUrl ? (
                  <a
                    href={app.user.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    app.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : app.status === "REVIEWED"
                      ? "bg-blue-100 text-blue-800"
                      : app.status === "ACCEPTED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <select
                  onChange={(e) =>
                    onStatusChange(
                      app.id,
                      e.target.value as Application["status"],
                    )
                  }
                  value={app.status}
                  className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
