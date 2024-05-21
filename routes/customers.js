const express = require('express');
require('dotenv').config();
const router = express.Router();
const Joi = require('joi');
const { Customer, validateCustomer } = require('../models/customers');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the customer
 *         name:
 *           type: string
 *           description: The name of the customer
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: The customers managing API
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Returns the list of all the customers
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/', auth, async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Creates a new customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The customer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad request
 */
router.post('/', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({ name: req.body.name });
    customer = await customer.save();
    res.send(customer);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Updates a customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The customer was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The customer with the given ID was not found
 */
router.put('/:id', auth, admin, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Deletes a customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer id
 *     responses:
 *       200:
 *         description: The customer was successfully deleted
 *       404:
 *         description: The customer with the given ID was not found
 */
router.delete('/:id', auth, admin, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

module.exports = router;
