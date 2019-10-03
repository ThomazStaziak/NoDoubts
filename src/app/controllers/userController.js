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

		const { originalname } = req.file;

		const user = await User.create({
			firstname,
			lastname,
			nickname,
			image: originalname,
			email,
			password_hash: bcrypt.hashSync(password_hash, 10)
		});

		const response = await axios
			.post(`${process.env.HOST}:${process.env.PORT}/validate-user`, {
				email: user.email,
				password_hash
			})
			.catch(() => res.render('index.hbs', { title: 'Erro logar' }));

		if (response.data)
			return res.render('index.hbs', {
				logado: true,
				username: user.nickname,
				user_image: user.image
			});
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
			req.session.logado = {
				id: user.id,
				username: user.nickname
			};
			res.render('index.hbs', {
				logado: true,
				username: user.nickname,
				user_image: user.image
			});
		} else {
			res.status(400).json({ error: 'Usuário ou senha inválidos' });
		}
	},

	async logout(req, res) {
		// const
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
	}
};
