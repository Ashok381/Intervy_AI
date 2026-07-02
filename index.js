import "./src/config/env.js";
import connectDB from "./src/db/dbconnect.js";
import app from "./src/App.js";

const startServer = async () => {
  try {
    await connectDB();

    app.on("error", (err) => {
      console.error("Server error:", err);
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error("Failed to start the server.");
    process.exit(1);
  }
};

startServer();
