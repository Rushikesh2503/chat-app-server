const express= require('express');
const cors=require('cors');
const mongoose= require('mongoose');
require('dotenv').config();
const connect=require('./configs/db')
const socket = require("socket.io");


const app=express();
const userRoutes=require('./routes/user.route')
const messageRoutes=require('./routes/message.route')
app.use(
  cors({
    origin: 'https://chat-app-public.vercel.app', // Replace with the actual origin of your frontend app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Specify the allowed headers
    credentials: true, // Enable sending cookies and other credentials
  })
);
app.use(express.json());

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)

const server =app.listen(process.env.PORT,async ()=>{
    await connect();
    console.log('Server is running on port '+process.env.PORT);
})

const io = socket(server, {
    cors: {
      origin: "https://chat-app-public.vercel.app",
      credentials: true,
    },
});
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
