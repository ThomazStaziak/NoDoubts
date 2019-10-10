const { User } = require('../models/');
const bcrypt = require('bcrypt');
const axios = require('axios');

module.exports = {
	async index(req, res) {
		const users = await User.findAll();
		console.log(users);
	},

	async searchById(req, res) {
		const id = req.params.id;
		const users = await User.findByPk(id);
		console.log(users);
	},

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
				avatar: user.image
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
	}
};
