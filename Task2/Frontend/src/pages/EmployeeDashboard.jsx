import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [activeTab, setActiveTab] = useState("all");
  const authToken = localStorage.getItem("authToken");

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    "Accepted for interview": "text-blue-600 bg-blue-50 border-blue-100",
    Rejected: "text-red-600 bg-red-50 border-red-100",
  };

  const statusIcons = {
    pending: "⏳",
    "Accepted for interview": "💼",
    Rejected: "❌",
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/user-details`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error.message);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/dashboard",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setJobListings(data);
      } catch (error) {
        setFetchError(error.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
    fetchUserProfile();
  }, [authToken]);

  const handleStatusUpdate = async (userId, newStatus, applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/application/status/${applicationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.info(data.message);
        const { data: updatedData } = await axios.get(
          "http://localhost:5000/api/users/dashboard",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setJobListings(updatedData);
      } else {
        toast.error("Email notification failed");
      }
    } catch (error) {
      console.error("Status update failed:", error.message);
      toast.error("Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full h-12 w-12 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
        Error: {fetchError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-500">
                Your Account
              </h2>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentUser?.name || "User"}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <span className="flex items-center text-gray-600 text-sm">
                  <svg
                    className="w-4 h-4 mr-1.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {currentUser?.email || "user@example.com"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Job Listings Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Listings
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {jobListings.length}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {Object.entries({
            pending: "Pending Applications",
            "Accepted for interview": "Interview Scheduled",
            Rejected: "Rejected Applications",
          }).map(([status, label]) => (
            <div
              key={status}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 ${
                      statusColors[status].replace("text-", "bg-").split(" ")[0]
                    } rounded-md p-3`}
                  >
                    <span className="text-white">{statusIcons[status]}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {jobListings.reduce(
                          (count, listing) =>
                            count +
                            listing.applicants.filter(
                              (app) => app.status === status
                            ).length,
                          0
                        )}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Your Job Postings
            </h2>
            <div className="text-sm text-gray-500">
              Showing {jobListings.length}{" "}
              {jobListings.length === 1 ? "job" : "jobs"}
            </div>
          </div>

          {jobListings.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No job listings
              </h3>
              <p className="mt-1 text-gray-500">
                You haven't posted any jobs yet.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Post New Job
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Active Job Postings
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {jobListings.map((listing) => (
                  <li key={listing._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-indigo-600">
                            {listing.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {listing.company} • {listing.location}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {listing.type || "Full-time"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {listing.description}
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            {listing.applicants.length} applicants
                          </div>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all applicants
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Applicants Section */}
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Recent Applicants
                      </h4>
                      {listing.applicants.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No applicants yet
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {listing.applicants.slice(0, 3).map((application) => (
                            <li
                              key={application._id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {application.user?.name?.charAt(0) || "A"}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    {application.user?.name || "Applicant"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {application.user?.email || "No email"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    statusColors[application.status]
                                  }`}
                                >
                                  {statusIcons[application.status]}{" "}
                                  {application.status}
                                </span>
                                <div className="flex space-x-2">
                                  <a
                                    href={application.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Resume
                                  </a>
                                  <select
                                    value={application.status}
                                    onChange={(e) =>
                                      handleStatusUpdate(
                                        application.user._id,
                                        e.target.value,
                                        application._id
                                      )
                                    }
                                    className="block pl-3 pr-10 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="Accepted for interview">
                                      Interview
                                    </option>
                                    <option value="Rejected">Reject</option>
                                  </select>
                                </div>
                              </div>
                            </li>
                          ))}
                          {listing.applicants.length > 3 && (
                            <li className="text-center">
                              <a
                                href="#"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                + {listing.applicants.length - 3} more
                                applicants
                              </a>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
