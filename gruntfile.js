/* ==========================================================================
// Gruntfile.js
// =========================================================================*/

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        less: {
          all: {
            options: {
              paths: ['<%= pkg.alloy.less %>/'],
              cleancss: true
            },
            files: {
              '<%= pkg.alloy.site %>/<%= pkg.alloy.css %>/fontloader.css': '<%= pkg.alloy.less %>/fontloader.less',
              '<%= pkg.alloy.site %>/<%= pkg.alloy.css %>/main.css': '<%= pkg.alloy.less %>/main.less'
            }
          }
        },

        jshint: {
          files: ['gruntfile.js','<%= pkg.alloy.js %>/main.js','<%= pkg.alloy.js %>/modules/*.js','!<%= pkg.alloy.js %>/modules/flickr.js'],
          options: {
            globals: {
              jQuery: true,
              console: true
            }
          }
        },

        clean: {
          jslibs: [
            '<%= pkg.alloy.js %>/libs/jquery/**/*',
            '!<%= pkg.alloy.js %>/libs/jquery/jquery.min.js',
            '<%= pkg.alloy.js %>/libs/jquery/.gitignore',
            '<%= pkg.alloy.js %>/libs/requirejs/**/*',
            '!<%= pkg.alloy.js %>/libs/requirejs/require.js',
            '<%= pkg.alloy.js %>/libs/requirejs/.gitignore',
            '<%= pkg.alloy.js %>/libs/respond/**/*',
            '!<%= pkg.alloy.js %>/libs/respond/respond.min.js',
            '<%= pkg.alloy.js %>/libs/selectivizr/**/*',
            '!<%= pkg.alloy.js %>/libs/selectivizr/selectivizr.js'
          ],
          html: ['<%= pkg.alloy.site %>/**/*.html','!<%= pkg.alloy.site %>/<%= pkg.alloy.assets %>/**/*.html']
        },

        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamic_mappings: {
              files: [
                {
                  expand: true, 
                  cwd: '<%= pkg.alloy.img %>/',
                  src: ['**/*.jpg','**/*.png'],
                  dest: '<%= pkg.alloy.site %>/<%= pkg.alloy.img %>' 
                }
              ]
            }
        },

        requirejs:{
          compile: {
              options: {
                  appDir: '<%= pkg.alloy.js %>',
                  baseUrl: ".",
                  dir: '<%= pkg.alloy.site %>/<%= pkg.alloy.assets %>/js/',
                  optimize: 'none',
                  //optimize: 'uglify',
                  //mainConfigFile: '<%= pkg.alloy.js %>/app.js',
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
              assets: '<%= pkg.alloy.site %>/<%= pkg.alloy.assets %>',
              layout: 'default.hbs',
              layoutdir: '<%= pkg.alloy.content %>/<%= pkg.alloy.layouts %>',
              data: '<%= pkg.alloy.content %>/<%= pkg.alloy.data %>/*.json',
              partials: '<%= pkg.alloy.content %>/<%= pkg.alloy.partials %>/**/*.hbs',
              dev: '<%= pkg.alloy.dev %>',
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
                cwd: '<%= pkg.alloy.content %>/',
                src: ['**/*.hbs', '!<%= pkg.alloy.layouts %>/**/*.hbs','!<%= pkg.alloy.partials %>/**/*.hbs'],
                dest: '<%= pkg.alloy.site %>/'
              }
            ]
          }
        },

        copy: {
          assets: { // Not less, js or img
            files: [
              {
                expand: true,
                src: ['<%= pkg.alloy.assets %>/**/*', '!<%= pkg.alloy.less %>/**/*', '!<%= pkg.alloy.js %>/**/*', '!<%= pkg.alloy.img %>/**/*'],
                dest: '<%= pkg.alloy.site %>/',
                filter: 'isFile'
              }
            ]
          },
          jslibs: {
            files: [
              {
                src: '<%= pkg.alloy.js %>/libs/respond/respond.min.js',
                dest: '<%= pkg.alloy.site %>/<%= pkg.alloy.js %>/libs/respond/respond.min.js'
              },
              {
                src: '<%= pkg.alloy.js %>/libs/selectivizr/selectivizr.js',
                dest: '<%= pkg.alloy.site %>/<%= pkg.alloy.js %>/libs/selectivizr/selectivizr.js'
              },
              {
                src: '<%= pkg.alloy.js %>/libs/jquery/jquery.min.js',
                dest: '<%= pkg.alloy.site %>/<%= pkg.alloy.js %>/libs/jquery/jquery.min.js'
              }
            ]
          }
        },

        connect: {
          server: {
            options: {
              port: '<%= pkg.alloy.port %>',
              base: '<%= pkg.alloy.site %>'
            }
          }
        },

        watch: {
          options: {
            livereload: 35730
          },
          watchless: {
            files: ['<%= pkg.alloy.less %>/**/*.less' ],
            tasks: ['less']
          },
          watchjs: {
            files: ['<%= pkg.alloy.js %>/app.js','<%= pkg.alloy.js %>/modules/*.js','<%= pkg.alloy.js %>/examples/*.js'],
            tasks: ['jshint','requirejs']
          },
          watchimages: {
            files: [
              '<%= pkg.alloy.img %>/**/*.jpg',
              '<%= pkg.alloy.img %>/**/*.png'
            ],
            tasks: ['imagemin']
          },
          watchassets: {
            files: [
              '<%= pkg.alloy.assets %>/**/*',
              '!<%= pkg.alloy.less %>/**/*',
              '!<%= pkg.alloy.js %>/**/*',
              '!<%= pkg.alloy.img %>/**/*',
              '!<%= pkg.alloy.data %>/**/*'
            ],
            tasks: ['copy:assets']
          },
          watchcontent: {
            files: [
              '<%= pkg.alloy.content %>/<%= pkg.alloy.data %>/*.json',
              '<%= pkg.alloy.content %>/**/*.hbs'
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