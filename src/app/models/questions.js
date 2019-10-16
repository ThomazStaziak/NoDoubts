'use strict';
module.exports = (sequelize, Sequelize) => {
	const Questions = sequelize.define(
		'Question',
		{
			title: Sequelize.STRING,
			content: Sequelize.STRING,
			users_id: Sequelize.INTEGER,
			categories_id: Sequelize.INTEGER
		},
		{
			tableName: 'questions'
		}
	);
	Questions.associate = function(models) {
		// associations can be defined here
		Questions.belongsTo(models.User, {
			foreignKey: 'users_id',
			as: 'user'
		}),
			Questions.belongsTo(models.Category, {
				foreignKey: 'categories_id',
				as: 'categories'
			});
	};
	return Questions;
};
