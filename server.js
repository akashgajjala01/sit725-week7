const express = require("express");
const http = require("http");
const { connectDatabase } = require("./dbconnection");
const cardRouter = require("./routers/routers");
const { Server } = require("socket.io");
const app = express();
const port = process.env.PORT || 5503;
const server = http.createServer(app);

// Updated CORS configuration for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5503", // Make sure this matches your frontend origin
    methods: ["GET", "POST"],
  },
});

connectDatabase()
  .then(() => {
    app.use(express.static(__dirname + "/public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Handle new socket connections
    io.on("connection", (socket) => {
      console.log("A user connected");

      // Listen for disconnect event
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

      // Example of sending data to the frontend
      setInterval(() => {
        socket.emit("number", parseInt(Math.random() * 10)); // Sending random number every 1 second
      }, 1000);
    });

    // Middleware to make io available in routes
    app.use((req, res, next) => {
      req.io = io; // Attach io to request object
      next();
    });

    // Use your routes (e.g., API routes)
    app.use("/api/tech", cardRouter);

    // Start the server
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
