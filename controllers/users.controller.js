const User=require('../models/user.model')
const bcrypt = require('bcrypt');



const register=async (req,res,next)=>{
   try {
    const{username,email,password} = req.body;
   let user=await User.findOne({email}).lean().exec();
   if (user) {
    return res.status(401).json({
        status: false,
        message: "Email id already exists please login",
    });
  } else {
    const hashedPassword = await bcrypt.hashSync(password,10);
    user = await User.create({username,email,password:hashedPassword});
    delete user.password;
    res.status(201).json({ status:true,user });
  }
    
   } catch (error) {
    return res.status(400).json({
          status: false,
          message: error.message,
      });
   }
}

const login = async (req,res,next)=>{

    try {
        const{email,password} = req.body;
       let user=await User.findOne({email}).lean().exec();
       if (!user) {
        return res.status(401).json({
            status: false,
            message: "Invalid credentials",
        });
      } else {
        const isPasswordValid = await bcrypt.compareSync(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                  status: false,
                  message: "Invalid Password",
              });
        }
        delete user.password;
        res.status(201).json({ status:true,user });
      }
        
       } catch (error) {
        next(error);
       }
}



const getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };
  
  const setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };
  
const logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };

module.exports ={register,login,setAvatar,logOut,getAllUsers}