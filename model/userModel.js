const JWT=require('jsonwebtoken')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'user Name is required'],
        minLength:[5,'Name must be 5 charcter'],
        maxLength:[20,'name less then 20 charcter'],
        trime:true
    },
    email:{
        type:String,
        requried:[true,'Email is required'],
        unique:[true, 'Email already registerd'],
        lowercase:true,

    },
    password:{
        type:String,
        select:false,
    },
    forgotpasswordtoken:{
        type:String,
    },
    forgotpasswordexpiry:{
        type:Date,
    }

},{
    timestamps:true,
});

// password bcrypt
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10) 
})

// crate token
userSchema.methods={
    jwtToken(){
        return JWT.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    },
}

const userModel=mongoose.model('user',userSchema)
module.exports=userModel;