let onlineUsers = [];
module.exports = (socket, io) => {
  // Join a user
  socket.on("join", (user_id) => {
    socket.join(user_id);
    // Saving Online USers
    if (!onlineUsers.some((user) => user.userId === user)) {
      onlineUsers.push({ userId: user_id, socketId: socket.id });
    }

    // Sending Online users to frontend
    io.emit("get-online-users", onlineUsers);
    // Send socket id
    io.emit("get_socket", socket.id);
  });

  //   socket disconnected
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
  });

  //   Join a conversation
  socket.on("join_conversation", (conversation_id) => {
    socket.join(conversation_id);
  });

  // Send and recieve message
  socket.on("new_message", (message) => {
    let conversation = message.conversation;
    if (!conversation?.users) return;

    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("message_recieved", message);
    });
  });
  // typing..
  socket.on("typing", (conversation_id) => {
    console.log("Typing", conversation_id);
    socket.in(conversation_id).emit("typing", conversation_id);
  });

  // stop typing
  socket.on("stop_typing", (conversation_id) => {
    console.log("stopped Typing", conversation_id);
    socket.in(conversation_id).emit("stop_typing");
  });
  // Call
  socket.on("call_user", (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId == userId);
    io.to(userSocketId.socketId).emit("call_user", {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
      socketId: userSocketId.socketId,
    });
  });

  // Answer Call
  socket.on("answer_call", (data) => {
    io.to(data.to).emit("call_accepted", {
      signal: data.signal,
      callerId: data.from,
    });
  });
  // End Call
  socket.on("call_ended", (id) => {
    let userId = id;
    let userSocketId = onlineUsers.find((user) => user.userId == userId);
    console.log(id);
    io.to(userSocketId).emit("call_ended");
  });
};
