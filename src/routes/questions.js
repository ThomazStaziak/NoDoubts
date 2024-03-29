const express = require('express');
const QuestionsController = require('../app/controllers/questionsController');
const auth = require('../app/middleware/auth');

const questions = new express.Router();

const {
	showQuestions,
	index,
	store,
	showByCategory,
	searchByName,
	userQuestions,
	addAnswer
} = QuestionsController;

// Home
questions.get('/', showQuestions);

// Add question
questions.get('/perguntas/adicionar', auth, index);
questions.post('/perguntas/adicionar', auth, store);

// Add answer
questions.get('/perguntas/:id', QuestionsController.searchById);

// Categories filter
questions.get('/categoria/:id', showByCategory);

// Find questions
questions.post('/buscar', searchByName);

// Show user questions
questions.get('/minhas/perguntas', auth, userQuestions);

// Add answer
questions.post('/add/answer', auth, addAnswer);

module.exports = questions;
