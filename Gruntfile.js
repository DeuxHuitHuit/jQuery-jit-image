/*global module:false, require:false*/

var md = require('matchdep');

module.exports = function(grunt) {

	"use strict";
	
	var serverPort = 8080;
	var server = 'http://localhost:' + serverPort;
	var sources = ['src/jquery.jit-image.js'];
	var testFile = server + '/tests/jquery.jit-image.js.test.html?';
	var gruntfile = 'Gruntfile.js';
	
	md.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		min: {
			dist: {
			src: ['<banner:meta.banner>', 'src/jquery.*.js'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		qunit: {
			all: {
				options: {
					urls: [testFile, testFile + '&jquery=1.10.2', testFile + '&jquery=1.9.1', testFile + '&jquery=1.8' ]
				}
			}
		},
		
		watch: {
			files: sources.concat(gruntfile),
			tasks: ['dev']
		},
		concat: {
			options: {
				process: true,
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: sources,
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		jshint: {
			files: sources.concat(gruntfile),
			options: {
				curly: true,
				eqeqeq: false, // allow ==
				immed: false, //
				latedef: false, // late definition
				newcap: false, // capitalize ctos
				nonew: true, // no new ..()
				noarg: true, 
				sub: true,
				undef: true,
				//boss: true,
				eqnull: true, // relax
				browser: true,
				regexp: true,
				strict: true,
				trailing: false,
				smarttabs: true,
				lastsemic: true,
				globals: {
					console: true,
					jQuery: true,
					DEBUG: true,
				}
			}
		},
		uglify: {
			prod: {
				files: {
					'dist/<%= pkg.name %>.min.js': '<%= concat.dist.dest %>' 
				}
			},
			options: {
				banner: '<%= meta.banner %>',
				report: 'gzip',
				sourceMap: 'dist/<%= pkg.name %>.min.js.map',
				sourceMappingURL: '<%= pkg.name %>.min.js.map',
				mangle: true,
				compress: {
					global_defs: {
						DEBUG: false
					},
					dead_code: true,
					unused: true,
					warnings: true
				}
			}
		},
		
		connect: {
			server: {
				port: serverPort,
				base: '.'
			}
		},
		
		complexity: {
			generic: {
				src: sources,
				options: {
					//jsLintXML: 'report.xml', // create XML JSLint-like report
					errorsOnly: false, // show only maintainability errors
					cyclomatic: 10, // 3
					halstead: 18, // 8
					maintainability: 95 //100
				}
			}
		}
	});
	
	// fix source map url
	grunt.registerTask('fix-source-map', 'Fix the wrong file path in the source map', function() {
		var sourceMapPath = grunt.template.process('<%= uglify.options.sourceMap %>');
		var sourceMapUrl = grunt.template.process('<%= uglify.options.sourceMappingURL %>');
		var diff = sourceMapPath.replace(sourceMapUrl, '');
		var sourceMap = grunt.file.readJSON(sourceMapPath);
		sourceMap.file = sourceMap.file.replace(diff, '');
		var newSources = [];
		sourceMap.sources.forEach(function (elem) {
			newSources.push(elem.replace(diff, ''));
		});
		sourceMap.sources = newSources;
		grunt.log.write(sourceMap.sources);
		grunt.file.write(sourceMapPath, JSON.stringify(sourceMap));
	});
	
	// Default task.
	grunt.registerTask('dev', ['jshint','complexity']);
	grunt.registerTask('build', ['concat','uglify', 'fix-source-map']);
	grunt.registerTask('test', ['connect','qunit']);
	grunt.registerTask('default', ['dev','test','build']);

};
