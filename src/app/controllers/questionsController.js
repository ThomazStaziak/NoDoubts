require('dotenv/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{ dialect: process.env.DB_PROVIDER }
);
const { formatDistanceToNow } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const { Category } = require('../models');
const { Question } = require('../models');
const { User } = require('../models');
const { Answer } = require('../models');

module.exports = {
	async index(req, res) {
		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

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

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / questions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		return res.render('novaPergunta.hbs', {
			categories,
			recentQuestions,
			trendQuestions
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
		const question = await Question.findOne({
			where: { id },
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			]
		});

		question.time = formatDistanceToNow(question.createdAt, {
			locale: ptBR,
			includeSeconds: true
		});

		const categories = await Category.findAll({
			attributes: ['id', 'title'],
			raw: true
		});

		const allQuestions = await Question.findAll();

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / allQuestions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
		});

		const recentQuestions = await Question.findAll({
			order: [['id', 'DESC']],
			limit: 5
		});

		const answers = await Answer.findAll({
			where: { questions_id: id },
			include: [{ model: User, as: 'user' }],
			order: [['id', 'DESC']]
		});

		answers.forEach(element => {
			element.time = formatDistanceToNow(element.createdAt, {
				locale: ptBR,
				includeSeconds: true
			});
		});

		return res.render('pergunta', {
			question,
			answers,
			categories,
			recentQuestions,
			trendQuestions
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

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / questions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
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
			recentQuestions,
			trendQuestions
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

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / questions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
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
			recentQuestions,
			trendQuestions
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

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / questions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
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
			recentQuestions,
			trendQuestions
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

		let trendQuestions = await sequelize.query(
			'select categories.title as title, count(questions.categories_id) as count from questions inner join categories on questions.categories_id = categories.id group by categories_id;',
			{ type: Sequelize.QueryTypes.SELECT }
		);

		trendQuestions.forEach(element => {
			element.progress = (element.count / questions.length) * 100;
		});

		trendQuestions = trendQuestions.sort((a, b) => {
			if (a.progress > b.progress) {
				return -1;
			}
			if (b.progress > a.progress) {
				return 1;
			}
			return 0;
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
			recentQuestions,
			trendQuestions
		};

		return res.render('index.hbs', data);
	},

	async addAnswer(req, res) {
		const { content, users_id, questions_id } = req.body;

		// const question = await Question.findOne({
		// 	where: {id: questions_id}
		// });

		await Answer.create({
			questions_id,
			content,
			users_id
		});

		return res.redirect(`/perguntas/${questions_id}`);
	}
};
