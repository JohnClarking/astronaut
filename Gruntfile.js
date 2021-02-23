'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var config = {
        app: 'src',
        dist: 'app/build',
        tmp: 'tmp'
    };

    grunt.initConfig({
        astronaut: config,
        watch: {
            compass: {
                files: ['<%= astronaut.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer', 'clean:dist', 'copy:dist', 'copy:images', 'copy:sounds']
            },
            styles: {
                files: ['<%= astronaut.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer', 'clean:dist', 'copy:dist', 'copy:images', 'copy:sounds']
            },
            jsLang: {
                files: ['<%= astronaut.app %>/lang/*'],
                tasks: ['i18n', 'clean:dist', 'copy:dist', 'copy:images']
            },
            scripts: {
                files: ['<%= astronaut.app %>/scripts/{,*/}*.js', '<%= astronaut.app %>/**/*.js'],
                tasks: ['jshint', 'copy:requirejs', 'requirejs:production', 'clean:dist', 'copy:dist', 'copy:images', 'copy:sounds'],
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                }
            },
            images: {
                files: ['<%= astronaut.app %>/images/{,*/}*.{png,jpg,jpeg}', '<%= astronaut.app %>/images/**/*.{png,jpg,jpeg}'],
                tasks: ['imagemin', 'clean:dist', 'copy:dist', 'copy:images', 'copy:sounds']
            },
            fonts: {
                files: ['<%= astronaut.app %>/styles/fonts/*'],
                tasks: ['copy:tmp', 'clean:dist', 'copy:dist', 'copy:images', 'copy:sounds']
            },
            sounds: {
                files: ['<%= astronaut.app %>/sound/{,*/}*.{mp3,ogg}'],
                tasks: ['copy:sounds']
            },
        },
        clean: {
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        '<%= astronaut.tmp %>/*',
                        '!<%= astronaut.tmp %>/.git*'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= astronaut.dist %>/*',
                        '!<%= astronaut.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= astronaut.tmp %>'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    '<%= astronaut.app %>/scripts/thirdparty/{,*/}*.js',
                    '<%= astronaut.app %>/scripts/modules/astronaut_i18n.js',
                    '<%= astronaut.app %>/scripts/libs/polyfills.js'
                ]
            },
            all: [
                '<%= astronaut.app %>/scripts/{,*/}*.js'
            ]
        },
        compass: {
            options: {
                sassDir: '<%= astronaut.app %>/styles',
                cssDir: '<%= astronaut.tmp %>/styles',
                generatedImagesDir: '<%= astronaut.tmp %>/images/generated',
                imagesDir: '<%= astronaut.app %>/images',
                javascriptsDir: '<%= astronaut.app %>/scripts',
                fontsDir: '<%= astronaut.app %>/styles/fonts',
                importPath: '<%= astronaut.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            tmp: {
                options: {
                    generatedImagesDir: '<%= astronaut.tmp %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= astronaut.tmp %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= astronaut.tmp %>/styles/'
                }]
            }
        },
        'bower-install': {
            app: {
                html: '<%= astronaut.app %>/index.html',
                ignorePath: '<%= astronaut.app %>/'
            }
        },
        uglify: {
            tmp: {
                options: {
                    banner: '',
                    output: {
                        beautify: false
                    },
                    compress: {
                        sequences: true,
                        global_defs: {
                            DEBUG: true
                        }
                    },
                    warnings: true,
                    mangle: true
                },
                // files: {
                //     '<%= astronaut.tmp %>/scripts/main.js': '<%= astronaut.tmp %>/scripts/main.js'
                // }
                files: [{
                    '<%= astronaut.tmp %>/scripts/main.js': '<%= astronaut.tmp %>/scripts/main.js',
                    '<%= astronaut.tmp %>/bower_components/requirejs/require.js': '<%= astronaut.tmp %>/bower_components/requirejs/require.js'
                }]
            }
        },
        imagemin: {
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= astronaut.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= astronaut.tmp %>/images'
                }]
            }
        },
        svgmin: {
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= astronaut.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= astronaut.tmp %>/images'
                }]
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= astronaut.tmp %>/styles/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= astronaut.tmp %>/styles/',
                ext: '.css'
            }
        },
        // Put files not handled in other tasks here
        copy: {
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= astronaut.app %>',
                    dest: '<%= astronaut.tmp %>',
                    src: [
                        '.htaccess',
                        'styles/fonts/{,*/}*.*',
                        'bower_components/jquery/jquery.min.map'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= astronaut.tmp %>',
                    dest: '<%= astronaut.dist %>',
                    src: [
                        '**'
                    ]
                }]
            },
            images: {
                expand: true,
                dot: true,
                cwd: '<%= astronaut.app %>/images',
                dest: '<%= astronaut.dist %>/images/',
                src: '**/*.{png,jpg,jpeg,svg}'
            },
            sounds: {
                expand: true,
                dot: true,
                cwd: '<%= astronaut.app %>/sound',
                dest: '<%= astronaut.dist %>/sound/',
                src: '{,*/}*.{mp3,ogg}'
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= astronaut.app %>/styles',
                dest: '<%= astronaut.tmp %>/styles/',
                src: '{,*/}*.css'
            },
            requirejs: {
                expand: true,
                dot: true,
                cwd: '<%= astronaut.app %>/bower_components/requirejs',
                dest: '<%= astronaut.tmp %>/bower_components/requirejs',
                src: 'require.js'
            },
            modernizr: {
                expand: true,
                dot: true,
                cwd: '<%= astronaut.app %>/bower_components/modernizr',
                dest: '<%= astronaut.tmp %>/bower_components/modernizr',
                src: 'modernizr.js'
            }
        },
        i18n: {
            src: ['<%= astronaut.app %>/lang/*.json'],
            dest: '<%= astronaut.app %>/scripts/modules/astronaut_i18n.js'
        },
        modernizr: {
            devFile: '<%= astronaut.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= astronaut.tmp %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= astronaut.tmp %>/scripts/{,*/}*.js',
                '<%= astronaut.tmp %>/styles/{,*/}*.css',
                '!<%= astronaut.tmp %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'compass',
                'copy:styles',
                'copy:requirejs'
            ],
            test: [
                'copy:styles',
                'copy:requirejs'
            ],
            tmp: [
                'compass',
                'copy:styles',
                'copy:requirejs',
                'svgmin'
            ],
            dist: [
                'copy:dist'
            ]
        },
        requirejs: {
            production: {
                options: {
                    baseUrl: "<%= astronaut.app %>/scripts",
                    mainConfigFile: "src/scripts/main.js",
                    out: "<%= astronaut.tmp %>/scripts/main.js",
                    preserveLicenseComments: false,
                    optimize: 'none'
                }
            },
            testing: {
                options: {
                    name: 'ATHENE2-TEST',
                    baseUrl: "<%= astronaut.app %>/tests/modules",
                    mainConfigFile: "src/tests/modules/specRunner.js",
                    out: "<%= astronaut.tmp %>/scripts/main.js",
                    preserveLicenseComments: false,
                    optimize: 'none'
                }
            }
        },
        "language-update": {
            src: [
                '<%= astronaut.app %>/scripts/{,*/}*.js'
            ],
            langSrc: [
                '<%= astronaut.app %>/lang/*.json'
            ],
            dest: '<%= astronaut.app %>/lang-processed'
        },
        concat: {
            test: {
                src: [
                    '<%= astronaut.app %>/bower_components/jasmine/lib/jasmine-core/jasmine.css',
                    '<%= astronaut.tmp %>/styles/main.css'
                ],
                dest: '<%= astronaut.tmp %>/styles/main.css'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: './app/',
                    open: true
                }
            }
        }
    });

    grunt.registerTask('dev', function (target) {
        if (target === 'tmp') {
            return grunt.task.run(['build']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'copy:requirejs',
            'requirejs:production',
            'copy:tmp',
            'copy:modernizr',
            'clean:dist',
            'copy:dist',
            'copy:images',
            'copy:sounds',
            'connect',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:tmp',
        'concurrent:tmp',
        'autoprefixer',
        'copy:tmp',
        'cssmin',
        'imagemin',
        'requirejs:production',
        'modernizr',
        'uglify',
        'clean:dist',
        'copy:sounds',
        'copy:dist',
        'clean:tmp'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('test', [
        'requirejs:testing',
        'concat:test'
    ]);
};
