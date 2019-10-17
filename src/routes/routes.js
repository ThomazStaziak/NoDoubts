const express = require('express');
const UserController = require('../app/controllers/userController');
const QuestionsController = require('../app/controllers/questionsController');
const AnswersController = require('../app/controllers/answersController');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const routes = new express.Router();
const upload = multer(uploadConfig);

//Questions Crud Start
routes.get('/perguntas/adicionar', QuestionsController.index);
routes.post('/perguntas/adicionar', QuestionsController.store);

//Answers Crud Start
routes.get('/perguntas/:id', QuestionsController.searchById);
// Users CRUD Start

// Edituser
routes.post('/edit-user/:id', UserController.update);

// Register user
routes.post('/register-user', upload.single('image'), UserController.create);

// Login
routes.post('/validate-user', UserController.validate);

//logout
routes.get('/logout', UserController.logout);

// Home
routes.get('/', QuestionsController.showQuestions);

// Category
routes.get('/categorias', async (req, res) => {
	await res.render('categoria.hbs');
});

// New Category
routes.get('/categorias/adicionar', async (req, res) => {
	await res.render('novaCategoria.hbs');
});

// New Question
routes.get('/questoes/adicionar', async (req, res) => {
	await res.render('novaPergunta.hbs');
});

// Questions
routes.get('/perguntas', async (req, res) => {
	await res.render('pergunta.hbs');
});

// Privacy Policies
routes.get('/politicas', async (req, res) => {
	await res.render('politicasDePrivacidade.hbs');
});

// Results
routes.get('/resultados', async (req, res) => {
	await res.render('resultados.hbs');
});

// Sub-category
routes.get('/sub-categorias', async (req, res) => {
	await res.render('subCategoria.hbs');
});

module.exports = routes;
