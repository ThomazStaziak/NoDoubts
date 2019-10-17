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

	async showQuestions(req, res) {
		const questions = await Question.findAll({
			include: [
				{ model: Category, as: 'categories' },
				{ model: User, as: 'user' }
			],
			order: [['id', 'DESC']]
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

		if (req.session.user) {
			const userQuestions = await Question.findAll({
				where: { users_id: req.session.user.id },
				limit: 5
			});

			data.userQuestions = userQuestions;
		}

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

		if (req.session.user) {
			const userQuestions = await Question.findAll({
				where: { users_id: req.session.user.id },
				limit: 5
			});

			data.userQuestions = userQuestions;
		}

		return res.render('index.hbs', data);
	}
};
