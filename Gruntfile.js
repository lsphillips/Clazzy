module.exports = function (grunt)
{
    // Dependencies
    // ----------------------------------------------------
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');


    // Configuration
    // ----------------------------------------------------
    
    grunt.initConfig(
    {
        // Cleaning
        // ------------------------------------------------

        clean :
        {
            src : ['dist']
        },
		
        
        // Tests
        // ------------------------------------------------

        nodeunit :
        {
            options :
            {
                reporter : 'verbose'
            },

            all : ['test/Clazz.Test.js']
        },


        // Compression
        // ------------------------------------------------

        uglify :
        {
            build :
            {
                src  : 'src/Clazz.js',
                dest : 'dist/Clazz.js'
            },

            options : { report : 'gzip' }
        },


        // Code Quality
        // ------------------------------------------------
        
        jshint :
        {
            options :
            {
                jshintrc : '.jshintrc'
            },
            
            src : ['src/Clazz.js', 'test/Clazz.Test.js']
        }
    });
    
    
    // Task: `default`
    // ----------------------------------------------------
    
    grunt.registerTask('default', ['jshint', 'nodeunit', 'clean', 'uglify']);
    
    // Task: `build`
    // ----------------------------------------------------
    
    grunt.registerTask('build', ['jshint', 'nodeunit', 'clean', 'uglify']);
    
    // Task: `test`
    // ----------------------------------------------------
    
    grunt.registerTask('test', ['jshint', 'nodeunit']);
};