'use strict';

// --------------------------------------------------------

module.exports = function (grunt)
{
	// Dependencies
	// -------------------------------------------------------

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Configuration
	// -------------------------------------------------------

	grunt.initConfig(
	{
		jshint :
		{
			options :
			{
				jshintrc : '.jshintrc'
			},

			src : ['src/Clazzy.js', 'tests/Clazzy.test.js']
		},

		// ------------------------------------------------------

		nodeunit :
		{
			options :
			{
				reporter : 'verbose'
			},

			all : ['tests/Clazzy.test.js']
		}
	});

	// Task: `test`
	// -------------------------------------------------------

	grunt.registerTask('test', ['jshint', 'nodeunit']);

	// Task: `default`
	// -------------------------------------------------------

	grunt.registerTask('default', ['test']);
};
