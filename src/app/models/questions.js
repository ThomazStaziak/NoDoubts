'use strict';
module.exports = (sequelize, Sequelize) => {
	const Questions = sequelize.define(
		'Questions',
		{
			title: {
				type: Sequelize.STRING
			},
			content:{
				type: Sequelize.STRING
			},
			users_id: {
				type: Sequelize.INTEGER
			},
			categories_id: {
				type: Sequelize.INTEGER
			} 
		},{
			tablename: 'questions'
		});
	// Questions.associate = function(models) {
	// 	// associations can be defined here
	// 	// Questions.belongsTo(models.User), Questions.belongsTo(models.Category);
	// };
	return Questions;
};
