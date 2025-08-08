require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service");
const { text } = require("stream/consumers");
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://ai-chat-bot-frontend-eight.vercel.app/",
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  /*In-built event */
  console.log("A user connected");

  /*In-built event */
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  /*Custom event */
  socket.on("ai-message", async (data) => {
    console.log("Recieved AI message:", data);
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });
    const response = await generateResponse(chatHistory);
    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    });
    socket.emit("ai-message-response", response);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});