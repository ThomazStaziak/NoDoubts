const { Questions , Category } = require('../models/');

module.exports = {
    // async index(req, res) {
	// 	const questions = await Questions.findAll();
	// 	console.log(questions);
    // },
    
    async showCategories(req,res) {
        const category = await Category.findAll();
        res.render('novaPergunta', { listaCategories:category });
    }
}