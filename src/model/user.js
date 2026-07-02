import mongoose from "mongoose" ;   
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username :{
        type : String , 
        required : [true , "username is required"] ,
        unique : true , 
    } , 
    email :{
        type : String ,
        required : [true , "email is required"] ,
        unique : true , 
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "Please fill a valid email address"]
    }, 
    password :{
        type : String , 
        required : [true , "password is required"] ,
    } , 
    refreshToken :{
        type : String 
    }
    
     } , {timestamps: true} ) 

userSchema.pre("save" , async function () {
    if(! this.isModified("password")) return 
    
    this.password = await bcrypt.hash(this.password , 10) 
    
})

userSchema.methods.isPasswordCorrect = async function(password){
 try {
     return   await bcrypt.compare(password , this.password) ; 
 } catch (error) {
    console.log(error)
 }
}

userSchema.methods.generateAccessToken =  function () {
     console.log("generating access token ")
    const accessToken =  jwt.sign(
        {
            id : this.id ,
            email : this.email 
        }, 
         process.env.ACCESS_TOKEN_SECRET, 
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY 

    }
    )
  
    return accessToken ; 
}

userSchema.methods.generateRefreshToken =  function() {
    console.log("generating refresh token ")
    const refreshToken =  jwt.sign(
        {
            id : this._id , 
        }, 
         process.env.REFRESH_TOKEN_SECRET , 
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY

    }
 )
   
 return refreshToken
}


export  const User = mongoose.model("User" , userSchema) ; 