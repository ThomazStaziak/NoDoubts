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
const { User } = require('../models/');
const bcrypt = require('bcrypt');
const axios = require('axios');

module.exports = {
	// find all users
	async index(req, res) {
		const users = await User.findAll();
		console.log(users);
	},

	// find users by primary key (id)
	async searchById(req, res) {
		const id = req.params.id;
		const users = await User.findByPk(id);
		console.log(users);
	},

	// Create user
	async create(req, res) {
		const {
			firstname,
			lastname,
			nickname,
			email,
			password_hash
		} = req.body;

		const { originalname: image } = req.file;

		const user = await User.create({
			firstname,
			lastname,
			nickname,
			image,
			email,
			password_hash: bcrypt.hashSync(password_hash, 10)
		});

		if (user) {
			req.session.actions = {
				signup: true
			};

			return res.redirect('/');
		}
	},

	// Validation
	async validate(req, res) {
		const { email, password_hash } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user) {
			res.status(400).json({ error: 'Usuário não existe' });
		}

		if (
			user.email == email &&
			bcrypt.compareSync(password_hash, user.password_hash)
		) {
			req.session.user = {
				logado: true,
				firstTime: true,
				id: user.id,
				nickname: user.nickname,
				avatar: user.image,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email
			};
			req.session.actions = {
				signup: false
			};
			return res.redirect('/');
		} else {
			return res.render('index.hbs', {
				loginError: true
			});
		}
	},

	async logout(req, res) {
		req.session.destroy();
		return res.redirect('/');
	},

	// User update
	async update(req, res) {
		const id = req.params.id;
		const {
			firstname,
			lastname,
			nickname,
			image,
			email,
			password_hash
		} = req.body;
		await User.update(
			{
				firstname: firstname,
				lastname: lastname,
				nickname: nickname,
				image: image,
				email: email,
				password_hash: password_hash
			},
			{
				where: {
					id: id
				}
			}
		)
			.then(user => {
				res.send('Usuario alterado com sucesso');
			})
			.catch(error => {
				res.send('Algum erro foi encontrado' + error);
			});
	},

	// User delete
	async deleteUser(req, res) {
		const id = req.params.id;
		User.destroy({
			where: { id: id }
		})
			.then(user => {
				res.redirect('/');
			})
			.catch(error => {
				res.send('Erro ao excluir usuario' + error + id);
			});
	},

	async myProfile(req, res) {
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

		return res.render('perfil.hbs', {
			title: 'Fórum',
			questions,
			categories,
			recentQuestions,
			trendQuestions
		});
	}
};
