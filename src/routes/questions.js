const express = require('express');
const QuestionsController = require('../app/controllers/questionsController');
const auth = require('../app/middleware/auth');

const questions = new express.Router();

const { showQuestions, index, store, showByCategory } = QuestionsController;

// Home
questions.get('/', showQuestions);

// Add question
questions.get('/perguntas/adicionar', auth, index);
questions.post('/perguntas/adicionar', auth, store);

questions.get('/perguntas/:id', QuestionsController.searchById);

// Categories filter
questions.get('/categoria/:id', showByCategory);

module.exports = questions;
