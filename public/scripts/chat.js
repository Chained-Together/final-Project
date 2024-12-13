const io = require('socket.io')(3001, {
  cors: { origin: '*' },
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(username);

    socket.to(roomId).emit('userJoined', { username });
  });

  socket.on('sendMessage', ({ roomId, message, sender }) => {
    io.to(roomId).emit('receiveMessage', { sender, message });
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        const username = rooms[roomId]?.find((name) => name === socket.id);
        if (username) {
          rooms[roomId] = rooms[roomId].filter((name) => name !== socket.id);
          socket.to(roomId).emit('userLeft', { username });
        }
      }
    }
  });

  socket.on('leaveRoom', ({ roomId, username }) => {
    socket.leave(roomId);

    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((name) => name !== username);
      socket.to(roomId).emit('userLeft', { username });
    }
  });
});
