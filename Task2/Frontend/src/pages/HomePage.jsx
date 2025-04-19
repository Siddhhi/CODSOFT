import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 transform skew-y-6 -rotate-6 origin-top-left"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                <span className="block">5000+ Career</span>
                <span className="block text-amber-300">
                  Opportunities Waiting
                </span>
              </h1>

              <p className="text-xl text-purple-100 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover your perfect role in our growing network of innovative
                companies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/jobs")}
                  className="px-8 py-3 bg-white hover:bg-gray-50 text-indigo-600 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Browse Jobs
                </button>
                {!isLoggedIn && (
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                  >
                    Join Now
                  </button>
                )}
              </div>

              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="ml-3 text-white">Verified companies</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="ml-3 text-white">No hidden fees</span>
                </div>
              </div>
            </div>
            <div className="flex  justify-center">
              <img
                className="w-120 rounded-2xl h-auto"
                src="/hero.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              We connect top talent with innovative companies for mutual success
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Smart Matching",
                description:
                  "Our algorithm connects you with the most relevant opportunities based on your skills.",
                icon: "🔍",
              },
              {
                name: "Career Growth",
                description:
                  "Access resources and mentorship to advance your professional journey.",
                icon: "📈",
              },
              {
                name: "Transparent Process",
                description:
                  "Clear communication and no hidden fees throughout your job search.",
                icon: "💎",
              },
            ].map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white text-xl mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-600 text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
