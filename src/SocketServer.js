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
  socket.on("outgoing-call", (data) => {
    let userSocketId = onlineUsers.find((user) => user.userId == data.to);
    if (userSocketId?.socketId) {
      io.to(userSocketId.socketId).emit("incoming-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });
  socket.on("reject-call", (id) => {
    let userSocketId = onlineUsers.find((user) => user.userId == id);
    if (userSocketId?.socketId) {
      io.to(userSocketId.socketId).emit("call-rejected");
    }
  });

  socket.on("accept-incoming-call", (id) => {
    console.log(id);
    let userSocketId = onlineUsers.find((user) => user.userId == id);
    if (userSocketId?.socketId) {
      io.to(userSocketId.socketId).emit("call-accepted");
    }
  });

  socket.on("editMsg", (data) => {
    let users = data.edt.conversation.users;
    if (!users) {
      return;
    }
    console.log(data);
    users = users.filter((user) => user !== data.user._id);
    console.log(users);
    users.forEach((user) => {
      let userSocketId = onlineUsers.find((item) => item.userId === user);
      console.log(userSocketId);
      if (userSocketId?.socketId) {
        console.log("hihi");
        io.to(userSocketId.socketId).emit("editMsg", data.edt);
      }
    });
  });
};
