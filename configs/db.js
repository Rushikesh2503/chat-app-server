const mongoose=require('mongoose');
require('dotenv').config();

const MongoURL = process.env.MONGO_URL;

const connect =()=>mongoose.connect(MongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('Connected to mongodb')
}).catch(()=>{
    console.log('Failed to connect to mongodb')
});

module.exports = connect;



