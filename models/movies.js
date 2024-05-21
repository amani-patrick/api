const mongoose = require('mongoose');
const Joi = require('joi');  


const Movie= mongoose.model('Movie', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,     
        maxlength: 50
    },
}));

function validateMovie(movie) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),

    });
    return schema.validate(movie);  
}

module.exports = {
    Movie,
    validateMovie
};



