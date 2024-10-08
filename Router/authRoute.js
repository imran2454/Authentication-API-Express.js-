const express=require('express')
const {signup,signin,getuser,logout}=require('../Controller/authController')
const authRouter=express.Router();
const jwtAuth=require('../middleware/jwtAuth')
authRouter.post('/signup',signup)
authRouter.post('/signin',signin)
authRouter.get('/getuser',jwtAuth,getuser)
authRouter.get('/logout',jwtAuth,logout)
module.exports=authRouter;