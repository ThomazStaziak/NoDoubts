'use strict';
module.exports = (sequelize, Sequelize) => {
	const Answer = sequelize.define(
		'Answer',
		{
			content: Sequelize.STRING,
			questions_id: Sequelize.INTEGER,
			users_id: Sequelize.INTEGER
		},
		{
			tableName: 'answers'
		}
	);
	Answer.associate = function(models) {
		Answer.belongsTo(models.User, {
			foreignKey: 'users_id',
			as: 'user'
		}),
			Answer.belongsTo(models.Category, {
				foreignKey: 'questions_id',
				as: 'questions'
			});
	};
	return Answer;
};
