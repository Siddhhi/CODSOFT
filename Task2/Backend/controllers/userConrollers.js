import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Application from "../models/applicationModel.js";
import nodemailer from "nodemailer";
import path from "path";
import Job from "../models/job.js";


export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(name, email, role);

  try {
    const user = await User.create({
      name, email, password: hashedPassword, role
    });
    console.log(user);
    res.status(201).json({ message: "User registered ", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentilas" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });


  res.json({ message: "Login Successfully", token, user: { email: user.email, role: user.role } });
}


export const getEmployerDashboard = async (req, res) => {
  try {
    console.log("Fetching dashboard for user: ", req.user);
    const jobs = await Job.find({ postedBy: req.user.id }).lean();

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found" });
    }

    for (let job of jobs) {
      const applications = await Application.find({ job: job._id })
        .populate("user", "name email")
        .lean();

      job.applicants = applications.map(app => ({
        _id: app._id,
        user: app.user,
        resumeUrl: app.resume ? `${process.env.BASE_URL}/uploads/${path.basename(app.resume)}` : null,
        status: app.status,
        appliedAt: app.createdAt
      }));
    }



    res.json(jobs);
  } catch (error) {
    console.log("Error in getEmployerDashboard: ", error);
    res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
};

export const getUserDetails = async (req, res) => {
  try {

    const userInfo = {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    };

    res.status(200).json(req.user);

  } catch (error) {
    console.error(error.message);
  }
}

export const getCandidateDashboard = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).populate("job", "title company location").lean();

    res.json(applications.map(app => ({
      _id: app._id,
      status: app.status,
      createdAt: app.createdAt,
      resume: app.resume,
      job: {
        _id: app.job?._id,
        title: app.job?.title,
        company: app.job?.company,
        location: app.job?.location,
      }
    })));
  } catch (error) {
    console.error("Error in candidate Dashboard:", error);
    res.status(500).json({ message: "Failed to load Dashboard" });
  }
}

export const updateApplicantStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { userId, status } = req.body;

  try {
    const application = await Application.findById(applicationId).populate("user job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jobboard66@gmail.com",
        pass: "valszlackbnnnmli"
      }
    });



    const mail = {
      from: process.env.EMAIL,
      to: application.user.email,
      subject: `Application Update: ${application.job.title} at ${application.job.company}`,
      text: `Dear ${application.user.name},
    
    We're writing to inform you about the status of your application for the ${application.job.title} position at ${application.job.company}.
    
    Current Status: ${status}
    
    ${status === 'Hired' ? 'Congratulations!' : 'Thank you for your patience throughout our selection process.'} We appreciate your interest in joining our team.
    
    ${status !== 'Rejected' ? 'Our team will contact you shortly with next steps.' : 'We encourage you to apply for future opportunities that match your skills.'}
    
    For any questions, please don't hesitate to reach out.
    
    Best regards,
    The ${application.job.company} Recruitment Team`
    };

    await transporter.sendMail(mail);

    res.status(200).json({ message: "Status updated and email sent successfully ." });
  } catch (error) {
    console.error("Error in updating application status : ", error);
    res.status(500).json({ message: "Failed to update status or send email" });
  }
};