const express = require('express');
const UserController = require('../app/controllers/userController');
const questionsController = require('../app/controllers/questionsController');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const routes = new express.Router();
const upload = multer(uploadConfig);


//Questions Crud Start

// Users CRUD Start

// Edituser
routes.post('/edit-user/:id', UserController.update);

// Register user
routes.post('/register-user', upload.single('image'), UserController.create);

// Login
routes.post('/validate-user', UserController.validate);

routes.get('/perguntas/adicionar', questionsController.showCategories);

//logout
routes.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return console.log(err);
		}
		res.redirect('/');
	});
});

// Home
routes.get('/', async (req, res) => {
	await res.render('index.hbs');
});

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

routes.post('/perguntas/adicionar', async (req, res) => {
	await res.render('novaPergunta.hbs');
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
