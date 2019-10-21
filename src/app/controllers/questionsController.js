const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { formatDistanceToNow } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const { Category } = require('../models');
const { Question } = require('../models');
const { User } = require('../models');

module.exports = {
	async index(req, res) {
		const categorias = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		return res.render('novaPergunta.hbs', {
			categorias
		});
	},

	async store(req, res) {
		const { title, content, users_id, categories_id } = req.body;

		await Question.create({
			title,
			content,
			users_id,
			categories_id
		});

		return res.redirect('/');
	},

	async searchById(req, res) {
		const id = req.params.id;
		const questions = await Question.findAll({
			where: { id },
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			]
		});
		return res.render('pergunta', {
			questions
		});
	},

	async showQuestions(req, res) {
		const questions = await Question.findAll({
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			],
			order: [['id', 'DESC']]
		});

		questions.forEach(element => {
			element.time = formatDistanceToNow(element.createdAt, {
				locale: ptBR,
				includeSeconds: true
			});
		});

		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		const data = {
			title: 'Fórum',
			questions,
			categories,
			recentQuestions
		};

		return res.render('index.hbs', data);
	},

	async searchByName(req, res) {
		const questions = await Question.findAll({
			where: { title: { [Op.like]: `%${req.body.search}%` } },
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			],
			order: [['id', 'DESC']]
		});

		questions.forEach(element => {
			element.time = formatDistanceToNow(element.createdAt, {
				locale: ptBR,
				includeSeconds: true
			});
		});

		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		const data = {
			title: 'Fórum',
			questions,
			categories,
			recentQuestions
		};

		return res.render('index.hbs', data);
	},

	async showByCategory(req, res) {
		const questions = await Question.findAll({
			where: { categories_id: req.params.id },
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			],
			order: [['id', 'DESC']]
		});

		questions.forEach(element => {
			element.time = formatDistanceToNow(element.createdAt, {
				locale: ptBR,
				includeSeconds: true
			});
		});

		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		const data = {
			title: 'Fórum',
			questions,
			categories,
			recentQuestions
		};

		return res.render('index.hbs', data);
	},

	async userQuestions(req, res) {
		const questions = await Question.findAll({
			where: { users_id: req.session.user.id },
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			],
			order: [['id', 'DESC']]
		});

		questions.forEach(element => {
			element.time = formatDistanceToNow(element.createdAt, {
				locale: ptBR,
				includeSeconds: true
			});
		});

		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		const data = {
			title: 'Fórum',
			questions,
			categories,
			recentQuestions
		};

		return res.render('index.hbs', data);
	}
};
