module.exports = function (grunt)
{
	// Dependencies
	// --------------------------------------------------------------
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Configuration
	// --------------------------------------------------------------
	
	grunt.initConfig(
	{
		package : grunt.file.readJSON('package.json'),

		// ----------------------------------------------------------

		jshint : // https://github.com/gruntjs/grunt-contrib-jshint
		{
			options :
			{
				jshintrc : '.jshintrc'
			},
			
			src : ['src/Clazzy.js', 'test/Clazzy.js']
		},

		nodeunit : // https://github.com/gruntjs/grunt-contrib-nodeunit
		{
			options :
			{
				reporter : 'verbose'
			},

			all : ['test/Clazzy.js']
		},

		uglify : // https://github.com/gruntjs/grunt-contrib-uglify
		{
			build :
			{
				files :
				{
					'build/Clazzy.js' : 'src/Clazzy.js' 
				}
			},

			options :
			{
				banner : '// Clazzy                                                         \n'
				       + '// Version: <%= package.version %>                                \n'
				       + '// Author: <%= package.author.name %> (<%= package.author.url %>) \n'
				       + '// License: <%= package.license %>                                \n',

				report : 'gzip'
			}
		}
	});
	
	// Task: `test`
	// --------------------------------------------------------------
	
	grunt.registerTask('test', ['jshint', 'nodeunit']);

	// Task: `build`
	// --------------------------------------------------------------
	
	grunt.registerTask('build', ['test', 'uglify']);

	// Task: `default`
	// --------------------------------------------------------------
	
	grunt.registerTask('default', ['build']);
};