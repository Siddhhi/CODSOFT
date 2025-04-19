import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ApplicantDashboard = () => {
  const [userProfile, setUserProfile] = useState({});
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const authToken = localStorage.getItem("authToken");

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    "Accepted for interview": "text-blue-600 bg-blue-50 border-blue-100",
    Rejected: "text-red-600 bg-red-50 border-red-100",
    Accepted: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  const statusIcons = {
    pending: "⏳",
    "Accepted for interview": "💼",
    Rejected: "❌",
    Accepted: "✅",
  };

  const filteredApplications =
    activeTab === "all"
      ? jobApplications
      : jobApplications.filter((app) => app.status === activeTab);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/user-details`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUserProfile(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error.message);
    }
  };

  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/candidate-dashboard",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setJobApplications(response.data);
      } catch (error) {
        console.error("Dashboard load error:", error.message);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };
    loadApplicationData();
    fetchUserData();
  }, [authToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full h-12 w-12 bg-gray-200"></div>
        </div>
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
              {userProfile?.name?.charAt(0).toUpperCase() || "T"}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-500">
                Your Profile
              </h2>
              <h1 className="text-2xl font-bold text-gray-800">
                {userProfile?.name || "Talent"}
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
                  {userProfile?.email || "user@example.com"}
                </span>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {userProfile?.role
                    ? userProfile.role.charAt(0).toUpperCase() +
                      userProfile.role.slice(1)
                    : "Candidate"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Dashboard
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Applications
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {jobApplications.length}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {Object.entries({
            pending: "Pending",
            "Accepted for interview": "Interviews",
            Accepted: "Accepted",
            Rejected: "Rejected",
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
                        {
                          jobApplications.filter((app) => app.status === status)
                            .length
                        }
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Application Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`${
                activeTab === "all"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Applications
            </button>
            {Object.keys(statusColors).map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`${
                  activeTab === status
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {status}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
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
              No applications found
            </h3>
            <p className="mt-1 text-gray-500">
              {activeTab === "all"
                ? "You haven't applied to any jobs yet."
                : `You don't have any ${activeTab.toLowerCase()} applications.`}
            </p>
            <div className="mt-6">
              <a
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse Jobs
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <li key={application._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[application.status]
                          }`}
                        >
                          {statusIcons[application.status]} {application.status}
                        </span>
                        <p className="ml-2 text-sm text-gray-500">
                          Applied on{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {application.resume && (
                        <a
                          href={`http://localhost:5000/uploads/${application.resume
                            .split("\\")
                            .pop()}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-lg font-medium text-gray-900">
                          {application.job?.title || "Position not specified"}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {application.job?.company || "Company not specified"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {application.job?.location || "Location not specified"}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicantDashboard;
