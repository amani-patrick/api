const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const Joi = require('joi'); 
require('dotenv').config();
const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,     
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,     
        maxlength: 255,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,     
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false 
    }
});
userSchema.methods.generateAuthToken=function (){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},process.env.jwtPrivateKey);
    return token;
}
const User = mongoose.model('User',userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean() 
    });
    return schema.validate(user);  
}

module.exports = {
    User,
    validateUser
};



