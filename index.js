require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const Joi=require('joi');
const users=require('./routes/users');
const genres=require('./routes/genres');
const customers=require('./routes/customers');
const movies=require('./routes/movies');
const auth=require('./routes/auth');
const config=require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app=express();
if(config.get('jwtPrivateKey')){
    console.error('Fatal error:jwtPrivateKey is not defined');
    process.exit(1);
}


app.use(express.json());

mongoose.connect('mongodb://localhost/Amnii', {
    serverSelectionTimeoutMS: 10000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AMNII API',
            version: '1.0.0',
            description: 'API documentation for amnii application',
        },
        servers: [
            {
                url: 'http://localhost:4500',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`App running on port ${port}`));

module.exports = app;
