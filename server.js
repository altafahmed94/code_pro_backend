const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE_HOST.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => console.log(`Connection sucessfully`));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  // console.log("Connected to socket.io");
  socket.on('setup', (userData) => {
    // console.log(userData);
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    // console.log("User Joined Room: " + room);
  });
  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on('new message', (newMessageRecieved) => {
    // console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return;
    //  console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user != newMessageRecieved.sender._id) {
        // console.log(user);
        socket.in(user).emit('message recieved', newMessageRecieved);
      }
    });
  });

  socket.off('setup', () => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
