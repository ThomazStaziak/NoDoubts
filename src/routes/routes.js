const express = require('express');
const UserController = require('../app/controllers/userController');
const auth = require('../app/middleware/auth');
const QuestionsController = require('../app/controllers/questionsController');
const AnswersController = require('../app/controllers/answersController');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const routes = new express.Router();
const upload = multer(uploadConfig);

//Questions Crud Start
routes.get('/perguntas/adicionar', auth, QuestionsController.index);
routes.post('/perguntas/adicionar', auth, QuestionsController.store);

//Answers Crud Start
routes.get('/perguntas/:id', QuestionsController.searchById);
// Users CRUD Start

// Edituser
routes.post('/edit-user/:id', UserController.update);

// Category
routes.get('/categorias', async (req, res) => {
	await res.render('categoria.hbs');
});

// New Category
routes.get('/categorias/adicionar', async (req, res) => {
	await res.render('novaCategoria.hbs');
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

module.exports = routes;
