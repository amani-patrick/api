const mongoose = require('mongoose');
const Joi = require('joi');  


const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,     
        maxlength: 50
    },
    role:{
        string:{
            type:String,
            required:true,
        }
    }
}));


function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),

    });
    return schema.validate(customer);  
}

module.exports = {
    Customer,
    validateCustomer
};


