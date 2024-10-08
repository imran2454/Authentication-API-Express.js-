const EmailValidator = require('email-validator')
const userModel = require("../model/userModel");
const bcrypt=require ('bcrypt')

const signup=async(req,res,next)=>{
    const {name,email,password}=req.body;
    console.log(name,email,password);
    if(!name || !email || !password ){
        return res.status(400).json({
            success:true,
            message:'Every field is required'
        })
    }
    const validemail=EmailValidator.validate(email)
    if(!validemail){
        return res.status(400).json({
            success:false,
            message:'Enter valid email address'
        })

    }
    // if(password==!confirmpassword){
    //     return res.status(400).json({
    //         success:false,
    //         message:'password and confirm password dosenot match'
    //     })
    // }
    try {
        const userInfo=  userModel(req.body);
        const result=await userInfo.save();
    
        return res.status(200).json({
            sucess:true,
            data:result,
        })
        
    } catch (err) {
        if(err.code===11000){
            return res.status(400).json({
                sucess:false,
                message:'Account already exist || Enter a new email id'
            })
        }
        return res.status(400).json({
            sucess:true,
            message:err.message
        })
        
        
        
    }
  
  
    

}

const signin=async(req,res)=>{
    const {email, password}=req.body;
    console.log(email,password);
    
    if(!email || !password){
        res.status(400).json({
            sucesss:false,
            message:'All field is required'
        })
    }
    try {
        const user= await userModel.findOne({email}).select('+password')
        // if(!user || user.password !== password){
        if(!user || !(bcrypt.compare(password,user.password))){
     res.status(400).json({
         sucess:false,
         message:'Invailid Crediantial'
     })
    }

    // define token
 const token=user.jwtToken();
 user.password=undefined;
 const cookieOption={
     maxAge:24*60*60*1000,
     httpOnly:true,
 };
 res.cookie('token',token, cookieOption)
 res.status(200).json({
     sucess:true,
     data:user,
 })

        
 } catch (error) {
  res.status(400).json({
     sucess:false,
     message:error.message
 })
        
    }
    

}

const getuser=async(req,res,nex)=>{
    const userId=req.user.id;
    try {
        const user=await userModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user,
        })
    } catch (e) {
        return res.status(400).json({
            success:false,
            message:e.message
        })
        
    }

}
const logout=(req,res)=>{
    try {
        const cookieOption={
            expires:new Date(),
            httpOnly:true
        }
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success:true,
            message:'Logout Successful'
        })
    } catch (e) {
        return res.status(400).json({
            success:true,
            message:e.message
        })
        
    }
}
module.exports={
    signup,
    signin,
    getuser,
    logout

}