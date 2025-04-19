import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileValidationError, setFileValidationError] = useState("");
  const userRole = localStorage.getItem("userRole");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/jobs/${id}`
        );
        setOpportunity(data);
      } catch (error) {
        toast.error("Failed to fetch opportunity details");
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id, navigate]);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(file.type)) {
        if (file.size <= 5 * 1024 * 1024) {
          setResumeFile(file);
          setFileValidationError("");
        } else {
          setFileValidationError("File size should be less than 5MB");
        }
      } else {
        setFileValidationError("Only PDF and Word documents are allowed");
      }
    }
  };

  const submitApplication = async () => {
    if (!authToken) {
      toast.error("Please log in to apply");
      return navigate("/signin");
    }

    if (!resumeFile) {
      setApplicationError("Please upload your resume");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setApplicationMessage(data.message);
      toast.success("Application submitted successfully!");
      setApplicationError("");
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to submit application";
      setApplicationError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !opportunity) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>{" "}
      </div>
    );
  }

  if (!opportunity) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-4 border-cyan-500 rounded-xl shadow-lg overflow-hidden">
        {" "}
        <div className="bg-cyan-600 px-6 py-4 text-white">
          {" "}
          <h1 className="text-2xl font-bold mb-2">
            Apply for {opportunity.title}
          </h1>
          <p className="text-cyan-100">{opportunity.company}</p>{" "}
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </h3>
              <p className="mt-1 text-gray-700">{opportunity.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Salary
              </h3>
              <p className="mt-1 text-gray-700">
                Rs. {opportunity.salary}/month
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Position Overview
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Key Requirements
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {opportunity.requirements
                .split("\n")
                .map((item, i) => item.trim() && <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Application Form */}
          {userRole === "jobseeker" ? (
            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF or Word)
                </label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-cyan-300 cursor-pointer hover:bg-cyan-50">
                    {" "}
                    <svg
                      className="w-8 h-8 text-cyan-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : "Choose file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </label>
                </div>
                {fileValidationError && (
                  <p className="mt-1 text-sm text-red-600">
                    {fileValidationError}
                  </p>
                )}
              </div>

              <button
                onClick={submitApplication}
                disabled={isLoading || !resumeFile}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                  isLoading || !resumeFile
                    ? "bg-cyan-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700"
                } transition-colors duration-200 flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>Only candidates can apply for this position.</p>{" "}
              {!authToken && (
                <button
                  onClick={() => navigate("/signin")}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sign In as Candidate
                </button>
              )}
            </div>
          )}

          {applicationMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
              {applicationMessage}
            </div>
          )}
          {applicationError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {applicationError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
