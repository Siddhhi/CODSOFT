import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Home,
  UserSquare,
  LogIn,
  LogOut,
  PlusCircle,
} from "lucide-react";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { authStatus, handleLogout, currentUser, userRole } =
    useContext(AppContext);

  const handleAuthentication = () => {
    if (authStatus) {
      handleLogout();
      navigate("/signin");
      toast.success("You've been successfully logged out");
    } else {
      navigate("/signin");
    }
  };

  const handlePostJob = () => {
    if (userRole === "employee") {
      navigate("/create-job");
    } else {
      toast.error("Only employers can post jobs");
    }
  };

  const handleDashboardNavigation = () => {
    if (!authStatus) {
      toast.info("Please sign in to access your dashboard");
      navigate("/signin");
      return;
    }

    if (userRole === "employee") {
      navigate("/employer-dashboard");
    } else {
      navigate("/candidate-dashboard");
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer h-12 w-24"
          >
            <img
              className="w-full h-full object-cover"
              src="/logo.jpg"
              alt="Company Logo"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Browse Jobs
            </button>
            <button
              onClick={handleDashboardNavigation}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <UserSquare className="h-5 w-5 mr-2" />
              Dashboard
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            {authStatus && userRole === "employee" && (
              <button
                onClick={handlePostJob}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Post Job</span>
              </button>
            )}

            <button
              onClick={handleAuthentication}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                authStatus
                  ? "border-transparent bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                  : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500"
              }`}
            >
              {authStatus ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </button>
          <button
            onClick={() => navigate("/jobs")}
            className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Browse Jobs
          </button>
          <button
            onClick={handleDashboardNavigation}
            className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            <UserSquare className="h-5 w-5 mr-3" />
            Dashboard
          </button>
          {authStatus && userRole === "employee" && (
            <button
              onClick={handlePostJob}
              className="w-full flex items-center px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              Post Job
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
