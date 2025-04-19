import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://siddhi570040:9eYss7KSS25VupPg@cluster0.pikmbys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(MONGO_URI, {
      dbName: 'job-board',
    });
    console.log("MongoDB Connected");
  }
  catch (error) {
    console.error("MongoDB connection failed ,", error);
  }
};

export default connectDB;