import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import JobDetails from "./pages/JobDetails";
import JobAvailable from "./pages/JobsAvailable";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import SignIn from "./pages/Sigin";
import Signup from "./pages/SignUp";
import CreateJob from "./pages/CreateJob";
import ApplyJob from "./components/ApplyJob";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-white min-h-[100vh]">
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobAvailable />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
          <Route path="/employer-dashboard" element={<EmployeeDashboard />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/candidate-dashboard" element={<ApplicantDashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
