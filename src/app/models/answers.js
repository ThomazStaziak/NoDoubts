'use strict';
module.exports = (sequelize, Sequelize) => {
	const Answers = sequelize.define(
		'answers',
		{
			content: Sequelize.STRING,
			questions_id: Sequelize.INTEGER,
			users_id: Sequelize.INTEGER
		},
		{
			tableName: 'answers'
		}
	);
	Answers.associate = function(models) {
		// associations can be defined here
		// Answers.belongsTo(models.User), Answers.belongsTo(models.Questions);
	};
	return Answers;
};