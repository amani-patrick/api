const express = require('express');
const jwt=require('jsonwebtoken'); 
require('dotenv').config();
const _=require('lodash');
const bcrypt=require('bcrypt');
const router = express.Router();
const auth=require('../middleware/auth')
const admin=require('../middleware/admin');
const Joi = require('joi'); 
const {User,validateUser}=require('../models/users');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         isAdmin:
 *           type: boolean
 *           description: Indicates if the user is an admin
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: secret
 *         isAdmin: false
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Gets the authenticated user's details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The details of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *               properties:
 *                 password:
 *                   type: string
 *                   description: The password of the user (excluded from the response)
 */
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *               properties:
 *                 password:
 *                   type: string
 *                   description: The password of the user (excluded from the response)
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();
    res.setHeader('Authorization', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
