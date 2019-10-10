'use strict';
module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define(
		'Category',
		{
			title: DataTypes.STRING
		},
		{
			tableName: 'categories'
		}
	);
	// Category.associate = function(models) {
	// 	// associations can be defined here
	// };
	return Category;
};
