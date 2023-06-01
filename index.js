require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8000
const http = require('http');
const server = http.createServer(app)
const { Server } = require('socket.io');
const Messages = require('./src/models/messages')
const MessagingUser = require('./src/models/users')
const connectDB = require('./src/db/connectDb');
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  }
})

io.on('connection', (socket) => {
  socket.on('send_user', async (data) => {
    socket.join(data?.room)
    let user = await MessagingUser.findOne({ name: data?.name });
    if (!user) {
      await MessagingUser.create({ name: data?.name })
    }

    let allUsers = await MessagingUser.find({});
    socket.emit('get_allUsers', allUsers)
    let messages = await Messages.find({ reciepient: data?.name })
    if (messages) {
      socket.emit('get_allMessages', messages)
    }
  })

  socket.on('send_message', async (message) => {
    await Messages.create({
      author: message.author,
      message: message.message,
      title: message.title,
      reciepient: message.reciepient
    })
    socket.to(message?.room).emit('recieve_messsage', message)
  })

  socket.on('disconnect', () => { })
})


const start = async () => {
  try {
    await connectDB(process.env?.MONGO_URL);
    server.listen(PORT, () => { });
  } catch (error) { }
};
start();
