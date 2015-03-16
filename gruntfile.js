/* ==========================================================================
// Gruntfile.js
// =========================================================================*/

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        less: {
          all: {
            options: {
              paths: ['<%= pkg.staddle.less %>/'],
              cleancss: true
            },
            files: {
              '<%= pkg.staddle.site %>/<%= pkg.staddle.css %>/fontloader.css': '<%= pkg.staddle.less %>/fontloader.less',
              '<%= pkg.staddle.site %>/<%= pkg.staddle.css %>/main.css': '<%= pkg.staddle.less %>/main.less'
            }
          }
        },

        jshint: {
          files: ['gruntfile.js','<%= pkg.staddle.js %>/main.js','<%= pkg.staddle.js %>/modules/*.js','!<%= pkg.staddle.js %>/modules/flickr.js'],
          options: {
            globals: {
              jQuery: true,
              console: true
            }
          }
        },

        clean: {
          jslibs: [
            '<%= pkg.staddle.js %>/libs/jquery/**/*',
            '!<%= pkg.staddle.js %>/libs/jquery/jquery.min.js',
            '<%= pkg.staddle.js %>/libs/jquery/.gitignore',
            '<%= pkg.staddle.js %>/libs/requirejs/**/*',
            '!<%= pkg.staddle.js %>/libs/requirejs/require.js',
            '<%= pkg.staddle.js %>/libs/requirejs/.gitignore',
            '<%= pkg.staddle.js %>/libs/respond/**/*',
            '!<%= pkg.staddle.js %>/libs/respond/respond.min.js',
            '<%= pkg.staddle.js %>/libs/selectivizr/**/*',
            '!<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js'
          ],
          html: ['<%= pkg.staddle.site %>/**/*.html','!<%= pkg.staddle.site %>/<%= pkg.staddle.assets %>/**/*.html']
        },

        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamic_mappings: {
              files: [
                {
                  expand: true, 
                  cwd: '<%= pkg.staddle.img %>/',
                  src: ['**/*.jpg','**/*.png'],
                  dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.img %>' 
                }
              ]
            }
        },

        requirejs:{
          compile: {
              options: {
                  appDir: '<%= pkg.staddle.js %>',
                  baseUrl: ".",
                  dir: '<%= pkg.staddle.site %>/<%= pkg.staddle.assets %>/js/',
                  optimize: 'uglify',
                  //mainConfigFile: '<%= pkg.staddle.js %>/app.js',
                  logLevel: 0,
                  findNestedDependencies: true,
                  fileExclusionRegExp: /^\./,
                  inlineText: true
              }
          }
        },

        assemble: {
          pages: {
            options: {
              flatten: true,
              assets: '<%= pkg.staddle.site %>/<%= pkg.staddle.assets %>',
              layout: 'default.hbs',
              layoutdir: '<%= pkg.staddle.content %>/<%= pkg.staddle.layouts %>',
              data: '<%= pkg.staddle.content %>/<%= pkg.staddle.data %>/*.json',
              partials: '<%= pkg.staddle.content %>/<%= pkg.staddle.partials %>/**/*.hbs',
              dev: '<%= pkg.staddle.dev %>',
              year: '<%= grunt.template.today("yyyy") %>',
              now: '<%= grunt.template.today("ddd dd MMMM yyyy - hh:mm:ss") %>',
              collections: [
                {
                  name: 'navigation-main',
                  sortby: 'navigation-order',
                  sortorder: 'ascending'
                },
                {
                  name: 'page-category',
                  sortby: 'title',
                  sortorder: 'ascending'
                }
              ]

            },
            files: [
              {
                expand: true,
                cwd: '<%= pkg.staddle.content %>/',
                src: ['**/*.hbs', '!<%= pkg.staddle.layouts %>/**/*.hbs','!<%= pkg.staddle.partials %>/**/*.hbs'],
                dest: '<%= pkg.staddle.site %>/'
              }
            ]
          }
        },

        copy: {
          assets: { // Not less, js or img
            files: [
              {
                expand: true,
                src: ['<%= pkg.staddle.assets %>/**/*', '!<%= pkg.staddle.less %>/**/*', '!<%= pkg.staddle.js %>/**/*', '!<%= pkg.staddle.img %>/**/*'],
                dest: '<%= pkg.staddle.site %>/',
                filter: 'isFile'
              }
            ]
          },
          jslibs: {
            files: [
              {
                src: '<%= pkg.staddle.js %>/libs/respond/respond.min.js',
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/respond/respond.min.js'
              },
              {
                src: '<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js',
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js'
              },
              {
                src: '<%= pkg.staddle.js %>/libs/jquery/jquery.min.js',
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/jquery/jquery.min.js'
              }
            ]
          }
        },

        connect: {
          server: {
            options: {
              port: '<%= pkg.staddle.port %>',
              base: '<%= pkg.staddle.site %>'
            }
          }
        },

        watch: {
          options: {
            livereload: 35730
          },
          watchless: {
            files: ['<%= pkg.staddle.less %>/**/*.less' ],
            tasks: ['less']
          },
          watchjs: {
            files: ['<%= pkg.staddle.js %>/app.js','<%= pkg.staddle.js %>/modules/*.js'],
            tasks: ['jshint','requirejs']
          },
          watchimages: {
            files: [
              '<%= pkg.staddle.img %>/**/*.jpg',
              '<%= pkg.staddle.img %>/**/*.png'
            ],
            tasks: ['imagemin']
          },
          watchassets: {
            files: [
              '<%= pkg.staddle.assets %>/**/*',
              '!<%= pkg.staddle.less %>/**/*',
              '!<%= pkg.staddle.js %>/**/*',
              '!<%= pkg.staddle.img %>/**/*',
              '!<%= pkg.staddle.data %>/**/*'
            ],
            tasks: ['copy:assets']
          },
          watchcontent: {
            files: [
              '<%= pkg.staddle.content %>/<%= pkg.staddle.data %>/*.json',
              '<%= pkg.staddle.content %>/**/*.hbs'
            ],
            tasks: ['clean:html','assemble']
          }
        }

    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default Tasks
    grunt.registerTask('default', ['less','jshint','requirejs','imagemin','clean','assemble','copy','connect','watch']);

};