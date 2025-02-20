const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message with the original ID
    io.emit("message", {
      id: data.id,
      text: data.text,
      sender: socket.id,
    });
  });

  socket.on("handle_reaction", (data) => {
    console.log("Received reaction:", data);
    // Broadcast the reaction to all clients
    io.emit("handle_reaction", {
      postId: data.postId,
      name: data.name,
      userId: data.userId,
    });
  });

  socket.on("add_reaction", (data) => {
    console.log("Received reaction:", data);
    // Broadcast the new reaction to all clients
    io.emit("add_reaction", {
      postId: data.postId,
      emoji: data.emoji,
      userId: data.userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("WebSocket server running on ws://localhost:4000");
