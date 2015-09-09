module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
	jshint: {
      all: ['Gruntfile.js', 'src/*.js', 'test/spec/*.js']
	},
	jasmine: {
      src: 'src/audiochart.js',
	  options: {
        specs: 'test/spec/*.spec.js'
	  }
    },
    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
          sourceMap: true,
        },
        files: {
          "build/audiochart.min.js": ["src/audiochart.js"]
        }
	  }
    },
  },

  grunt.registerTask("default", [
    "jshint",
    "jasmine",
	"uglify"
  ]));
};