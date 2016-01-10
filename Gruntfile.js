module.exports = function (grunt)
{
	// Dependencies
	// --------------------------------------------------------------

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Configuration
	// --------------------------------------------------------------

	grunt.initConfig(
	{
		jshint :
		{
			options :
			{
				jshintrc : '.jshintrc'
			},

			src : ['src/Clazzy.js', 'tests/Clazzy.js']
		},

		nodeunit :
		{
			options :
			{
				reporter : 'verbose'
			},

			all : ['tests/Clazzy.js']
		}
	});

	// Task: `test`
	// --------------------------------------------------------------

	grunt.registerTask('test', ['jshint', 'nodeunit']);

	// Task: `build`
	// --------------------------------------------------------------

	grunt.registerTask('build', ['test']);

	// Task: `default`
	// --------------------------------------------------------------

	grunt.registerTask('default', ['build']);
};
