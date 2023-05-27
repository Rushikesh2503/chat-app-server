const express= require('express');
const cors=require('cors');
const mongoose= require('mongoose');
require('dotenv').config();
const connect=require('./configs/db')
const socket = require("socket.io");


const app=express();
const userRoutes=require('./routes/user.route')
const messageRoutes=require('./routes/message.route')
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/testapi",(req,res)=>{
  console.log("Test")

  return res.json({success:"teste"});
})

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
