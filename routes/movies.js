const express = require('express');
require('dotenv').config();
const router = express.Router();
const admin = require('../middleware/admin');
const { Movie, validateMovie } = require('../models/movies');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         name:
 *           type: string
 *           description: The name of the movie
 *       example:
 *         id: d5fE_asz
 *         name: Inception
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The movies managing API
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/', auth, async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Creates a new movie
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request
 */
router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = new Movie({ name: req.body.name });
    movie = await movie.save();
    res.send(movie);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Updates a movie
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The movie was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The movie with the given ID was not found
 */
router.put('/:id', auth, admin, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Deletes a movie
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie was successfully deleted
 *       404:
 *         description: The movie with the given ID was not found
 */
router.delete('/:id', auth, admin, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

module.exports = router;
