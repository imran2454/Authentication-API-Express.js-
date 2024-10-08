require('dotenv').config();
const express=require('express');
const authRouter = require('./Router/authRoute');
const PORT=process.env.PORT
const cookieParser=require('cookie-parser')

const app=express();
const databaseconnect=require('./config/databaseConfig')

databaseconnect();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth/',authRouter)
app.use('/',function(req,res){
    res.send('this is homePage')
})
app.listen(PORT,(req,res)=>{
    console.log(`server is running at port ${PORT}`);
    
})