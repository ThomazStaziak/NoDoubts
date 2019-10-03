'use strict';
module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define(
		'Category',
		{
			title: {
				type: Sequelize.STRING
			}
		},{
			tablename: 'categories'
		}
	);
	// Category.associate = function(models) {
	// 	// associations can be defined here
	// };
	return Category;
};
