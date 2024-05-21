const express = require('express');
const auth = require('../middleware/auth');
require('dotenv').config();
const router = express.Router();
const admin = require('../middleware/admin');
const { Genre, validateGenre } = require('../models/genres');

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the genre
 *         name:
 *           type: string
 *           description: The name of the genre
 *       example:
 *         id: d5fE_asz
 *         name: Action
 */

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: The genres managing API
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Returns the list of all the genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: The list of the genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 */
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Creates a new genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: The genre was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad request
 */
router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Updates a genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The genre id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: The genre was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The genre with the given ID was not found
 */
router.put('/:id', auth, admin, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Deletes a genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The genre id
 *     responses:
 *       200:
 *         description: The genre was successfully deleted
 *       404:
 *         description: The genre with the given ID was not found
 */
router.delete('/:id', auth, admin, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

module.exports = router;
