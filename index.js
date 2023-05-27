const express= require('express');
const cors=require('cors');
const mongoose= require('mongoose');
require('dotenv').config();
const connect=require('./configs/db')


const app=express();
const userRoutes=require('./routes/user.route')

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes)

app.listen(process.env.PORT,async ()=>{
    await connect();
    console.log('Server is running on port '+process.env.PORT);
})

