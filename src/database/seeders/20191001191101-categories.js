'use strict';

module.exports = {
	up: queryInterface =>
		queryInterface.bulkInsert(
			'categories',
			[
				{
					title: 'HTML',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'Bootstrap',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'CSS',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'JavaScript',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'PHP',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'MySQL',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'Laravel',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'Nivelamento',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'GIT',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'React',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					title: 'Deploy',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			],
			{ timestamps: false }
		),

	down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
