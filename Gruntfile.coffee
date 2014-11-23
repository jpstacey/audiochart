module.exports = (grunt) ->
    # Project configuration
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")

        # Convert main code and specs to JavaScript
        coffee:
            main:
                options:
                    sourceMap: true
                files:
                    "build/audiochart.js": "audiochart.coffee"
            specs:
                expand: true
                cwd: 'spec/'
                src: ['*.spec.coffee']
                dest: 'test/spec/'
                ext: '.spec.js'

        # Copy the HTML fixtures from the CoffeeScript spec directory
        # to the JavaScript spec directory (for in-browser tests)
        copy:
            main:
                src: "spec/HTMLTableDataWrapper.fixtures.html"
                dest: "test/spec/HTMLTableDataWrapper.fixtures.html"

        # Minify the built JavaScript
        uglify:
            options:
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                sourceMap: true
                sourceMapIn: "build/audiochart.js.map"
            build:
                src: "build/audiochart.js"
                dest: "build/audiochart.min.js"

        # Run the tests (via Node, in CoffeeScript)
        jasmine_node:
            options:
                forceExit: true
                match: "."
                matchall: false
                extensions: "coffee"
                specNameMatcher: "spec"
            all: [ "spec/" ]

    # Loading Tasks
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-jasmine-node"

    # Setting up Tasks
    grunt.registerTask "default", [ "jasmine_node", "coffee", "copy", "uglify" ]
