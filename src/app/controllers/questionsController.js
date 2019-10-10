const { Category } = require('../models');
const { Question } = require('../models');

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
	}
};
