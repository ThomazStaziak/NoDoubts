const { Category } = require('../models');
const { Question } = require('../models');
const { User } = require('../models');

module.exports = {
	async index(req, res) {
		if (!req.session.user) return res.redirect('/');

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
			where: {id},
				include: [
					{ model: Category, as: 'categories' },
					{ model: User, as: 'user' }
				],
			}
		)
		return res.render('pergunta' , {
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

		return res.render('index.hbs', {
			title: 'Fórum',
			questions
		});
	}
};
