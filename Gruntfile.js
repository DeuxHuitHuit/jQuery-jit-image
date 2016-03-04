/*global module:false, require:false*/

var md = require('matchdep');

module.exports = function (grunt) {

	'use strict';
	
	var serverPort = 8080;
	var server = 'http://localhost:' + serverPort;
	var SRC_FILES = ['src/jquery.jit-image.js'];
	var TEST_FILES = server + '/tests/jquery.jit-image.js.test.html?';
	var GRUNT_FILE = 'Gruntfile.js';
	var BUILD_FILE = './build.json';
	
	// Project configuration.
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		buildnum: {
			options: {
				file: BUILD_FILE
			}
		},
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> ' +
			'- build <%= buildnum.num %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author.name %> (<%= pkg.author.url %>);\n' +
			'* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
		},
		concat: {
			options: {
				process: true,
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: SRC_FILES,
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		qunit: {
			all: {
				options: {
					urls: [
						TEST_FILES,
						TEST_FILES + '&jquery=2.1.3',
						TEST_FILES + '&jquery=2.0.3',
						TEST_FILES + '&jquery=1.11.2',
						
					]
				}
			}
		},
		
		watch: {
			files: SRC_FILES.concat(GRUNT_FILE),
			tasks: ['dev']
		},
		
		jshint: {
			files: SRC_FILES.concat(GRUNT_FILE),
			options: {
				bitwise: false,
				camelcase: false,
				curly: true,
				eqeqeq: false, // allow ==
				forin: true,
				//freeze: true,
				immed: false, //
				latedef: false, // late definition
				newcap: true, // capitalize ctos
				noempty: true,
				nonew: true, // no new ..()
				noarg: true, 
				plusplus: false,
				quotmark: 'single',
				undef: true,
				maxparams: 5,
				maxdepth: 5,
				maxstatements: 30,
				maxlen: 100,
				//maxcomplexity: 10,
				
				// relax options
				//boss: true,
				//eqnull: true, 
				esnext: true,
				regexp: true,
				strict: true,
				trailing: false,
				sub: true, // [] notation
				smarttabs: true,
				lastsemic: false, // enforce semicolons
				white: true,
				
				// env
				browser: true,
				
				globals: {
					jQuery: true,
					console: true,
					App: true,
					Loader: true
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
				options: {
					port: serverPort,
					base: '.'
				}
			}
		},
		
		complexity: {
			generic: {
				src: SRC_FILES,
				options: {
					//jsLintXML: 'report.xml', // create XML JSLint-like report
					errorsOnly: false, // show only maintainability errors
					cyclomatic: 11, // 3
					halstead: 22, // 8
					maintainability: 95 //100
				}
			}
		}
	};
	
	var init = function (grunt) {
		grunt.file.preserveBOM = true;
		
		// Project configuration.
		grunt.initConfig(config);
		
		// generate build number
		grunt.registerTask('buildnum', 
			'Generates and updates the current build number', function () {
			var options = this.options();
			var getBuildNumber = function () {
				var b = {};
				
				try {
					b = grunt.file.readJSON(options.file);
				} catch (e) {}
				
				b.lastBuild = b.lastBuild > 0 ? b.lastBuild + 1 : 1;
				
				grunt.file.write(options.file, JSON.stringify(b));
				
				return b.lastBuild;
			};

			var buildnum = getBuildNumber();
			grunt.log.writeln('New build num: ', buildnum);
			grunt.config.set('buildnum.num', buildnum);
		});
		
		// fix source map url
		grunt.registerTask(
				'fix-source-map', 
				'Fix the wrong file path in the source map',
				function () {
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
		grunt.registerTask('dev',     ['jshint', 'complexity']);
		grunt.registerTask('build',   ['buildnum', 'concat', 'uglify', 'fix-source-map']);
		grunt.registerTask('test',    ['connect', 'qunit']);
		grunt.registerTask('default', ['dev', 'test', 'build']);
	};
	
	var load = function (grunt) {
		md.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
		
		init(grunt);
	};
	
	load(grunt);
};
