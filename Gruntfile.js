'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  var path = require('path');
  var parts = path.resolve().split('/'), current_dir = parts[parts.length-1];
  var _ = require('lodash');

  // Load required Grunt tasks. These are installed based on the versions listed
  // * in 'package.json' when you do 'npm install' in this directory.

  /** ********************************************************************************* */
  /** **************************** File Config **************************************** */
  var fileConfig = {
    dist_dir: 'dist',
    compile_dir: 'dist',
    current_dir: current_dir,
    deployRoot: './', 

    /**
     * This is a collection of file patterns for our app code (the
     * stuff in 'src/'). These paths are used in the configuration of
     * build tasks. 'js' is all project javascript, except tests.
     * 'commonTemplates' contains our reusable components' ('src/common')
     * template HTML files, while 'appTemplates' contains the templates for
     * our app's code. 'html' is just our main HTML file. 'less' is our main
     * stylesheet, and 'unit' contains our app's unit tests.
     *
     */

    app_files: {
      js: [
        './src/**/*.module.js',
        'src/**/*.js',
        '!./src/**/*.module.js',
        '!src/**/*.spec.js',
        '!src/**/*.newdesign.js',
        '!src/assets/**/*.js'
      ],
      jsunit: ['src/**/*.spec.js'],

      appTemplates: ['src/app/**/*.tpl.html'],
      commonTemplates: ['src/common/**/*.tpl.html'],
      htmlFiles: ['src/app/newdesign/examples/**/*'],

      html: ['src/index.html'],
      ico: [
        'favicon.ico',
        'manifest.json',
        'browserconfig.xml'
      ],
      less: [
        'src/less/main.less', 'vendor/bootstrap/bootstrap.less',
        'src/less/style.less', 'vendor/bootstrap/bootstrap.less',
        'src/less/style-blue.less', 'vendor/bootstrap/bootstrap.less'
      ]
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
      js: [
        'vendor/angular-mocks/angular-mocks.js'
      ]
    },

    /**
     * This is the same as 'app_files', except it contains patterns that
     * reference vendor code ('vendor/') that we need to place into the build
     * process somewhere. While the 'app_files' property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in 'vendor_files.js'.
     *
     * The 'vendor_files.js' property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The 'vendor_files.css' property holds any CSS files to be automatically
     * included in our app.
     *
     * The 'vendor_files.assets' property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
      js: [
        'vendor/api-check/dist/api-check.min.js',
        'vendor/angular/angular.min.js',
        'vendor/angular-formly/dist/formly.min.js',
        'vendor/angular-mask/dist/ngMask.min.js',
        'vendor/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/angular-ui-select/dist/select.min.js',
        'vendor/angular-sanitize/angular-sanitize.min.js',
        'vendor/angular-resource/angular-resource.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.min.js',
        'vendor/angular-ui-utils/modules/route/route.js',
        'vendor/angular-animate/angular-animate.min.js',
        'vendor/angular-messages/angular-messages.min.js',
        'vendor/angular-aria/angular-aria.min.js',
        'vendor/angular-resource/angular-resource.min.js',
        'vendor/angular-touch/angular-touch.min.js',
        'vendor/lodash/lodash.min.js',
        'vendor/angular-ui-utils/ui-utils.min.js',
        'vendor/moment/min/moment.min.js',
        'vendor/angular-momentjs/angular-momentjs.min.js',
        'vendor/angular-translate/angular-translate.min.js',
        'vendor/angular-translate-loader-url/angular-translate-loader-url.min.js',
        'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'vendor/ng-idle/angular-idle.min.js',
        'vendor/angular-loading-bar/build/loading-bar.min.js',
        'vendor/ng-currency/dist/ng-currency.min.js'
      ],
      js_dist_only: [
        'vendor/less.js/dist/less.min.js'
      ],
      js_map: [
        'vendor/api-check/dist/api-check.min.js.map',
        'vendor/angular/angular.min.js.map',
        'vendor/angular-animate/angular-animate.min.js.map',
        'vendor/angular-messages/angular-messages.min.js.map',
        'vendor/angular-mask/dist/ngMask.min.map',
        'vendor/angular-aria/angular-aria.min.js.map',
        'vendor/angular-resource/angular-resource.min.js.map',
        'vendor/angular-sanitize/angular-sanitize.min.js.map',
        'vendor/angular-touch/angular-touch.min.js.map',
        'vendor/lodash/lodash.min.js.map',
        'vendor/angular-momentjs/angular-momentjs.min.js.map',
        'vendor/angular-translate/angular-translate.min.js.map',
        'vendor/ng-idle/angular-idle.map',
        'vendor/angular-formly/dist/formly.min.js.map',
        'vendor/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js.map'
      ],
      css: [
        'vendor/angular-ui-select/dist/select.min.css'
      ],
      less: [
        'vendor/bootstrap/less/**/*.less'
      ],
      assets: [
        'less/**',
        'assets/**',
        'common/**/*.less',
        'app/**/*.less'
      ]
    }
  };

  /** ********************************************************************************* */
  function updateDeployRoot(pkg) {
    pkg.deployRoot = fileConfig.deployRoot;
    return pkg;
  }
  /** **************************** Task Config **************************************** */
  var taskConfig = {
    pkg: updateDeployRoot(grunt.file.readJSON('package.json')),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the '<%='
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' *\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' */\n'
    },

    /**
     * The directories/files to delete when 'grunt clean' is executed.
     */
    clean: {
      options: { force: true },
      all: [
        '<%= pkg.deployRoot %><%= dist_dir %>',
        '<%= pkg.deployRoot %><%= compile_dir %>'
      ],
      vendor: [
        '<%= pkg.deployRoot %><%= dist_dir %>/vendor/'
      ],
      index: [
        '<%= pkg.deployRoot %><%= dist_dir %>/index.html'
      ]
    },

    /**
     * The 'copy' task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and JavaScript files into
     * 'dist_dir', and then to copy the assets to 'compile_dir'.
     */
    copy: {
      build_app_assets: {
        files: [
          {
            src: ['**'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      build_html_assets: {
        files: [
          {
            src: ['<%= app_files.htmlFiles %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: ['<%= vendor_files.less %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          },
          {
            src: ['**'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/fonts/',
            cwd: 'vendor/bootstrap/fonts',
            expand: true
          },
          {
            src: ['<%= vendor_files.assets %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/src/',
            cwd: 'src',
            expand: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_appico: {
        files: [
          {
            src: ['<%= app_files.ico %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs_map: {
        files: [
          {
            src: ['<%= vendor_files.js_map %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/assets/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: ['<%= vendor_files.js %>', '<%= vendor_files.js_dist_only %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: ['<%= vendor_files.css %>'],
            dest: '<%= pkg.deployRoot %><%= dist_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: ['fonts/*', 'images/*'],
            dest: '<%= pkg.deployRoot %><%= compile_dir %>/assets',
            cwd: '<%= pkg.deployRoot %><%= dist_dir %>/assets',
            expand: true
          },
          {
            src: ['**'],
            dest: '<%= pkg.deployRoot %><%= compile_dir %>/fonts',
            cwd: '<%= pkg.deployRoot %><%= dist_dir %>/fonts',
            expand: true
          }
        ]
      },
      compile_jsmap: {
        files: [
          {
            src: ['**/*.map'],
            dest: '<%= pkg.deployRoot %><%= compile_dir %>/assets/',
            cwd: '<%= pkg.deployRoot %><%= dist_dir %>/assets',
            expand: true
          }
        ]
      },
      compile_ico: {
        files: [
          {
            src: ['*.ico'],
            dest: '<%= pkg.deployRoot %><%= compile_dir %>',
            cwd: '<%= pkg.deployRoot %><%= dist_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * 'grunt concat' concatenates multiple source files into a single file.
     */
    concat: {
      // The 'build_css' target concatenates compiled CSS and vendor CSS together.
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        min_dest: '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.css'
      },
      // The 'compile_css' target concatenates compiled CSS and vendor CSS together.
      compile_css: {
        src: [
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= pkg.deployRoot %><%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.css'
      },
      // The 'compile_js' target concatenates app and vendor js code together.
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= pkg.deployRoot %><%= dist_dir %>/src/**/*.module.js',
          '<%= pkg.deployRoot %><%= dist_dir %>/src/**/*.js',
          '!<%= pkg.deployRoot %><%= dist_dir %>/src/**/*.newdesign.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= pkg.deployRoot %><%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js',
        min_dest: '<%= pkg.deployRoot %><%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    /**
     * 'ng-annotate' annotates the sources for safe minification. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      build: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            cwd: '<%= pkg.deployRoot %><%= dist_dir %>',
            dest: '<%= pkg.deployRoot %><%= dist_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.min_dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    // Use a custom variables.less file to update custom/config.json & our local copy of bootstrap/config.json
    bootstrap_less2json: {
      custom_options: {
        options: {
          dist: 'src/less/bootstrap/'
        },
        files: {
          'src/less/custom/config.json': 'src/less/custom/variables.less'
        }
      }
    },
    // Use our local copy of Bootstrap config.json to update the Bootstrap variables.less file
    bootstrap_json2less: {
      custom_options: {
        files: {
          'src/less/bootstrap/variables.less': 'src/less/bootstrap/config.json'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our 'main.less' file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less[0] %>',
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>-style.css': '<%= app_files.less[2] %>',
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>-style-blue.css': '<%= app_files.less[4] %>'
        }
      },
      compile: {
        files: {
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.css': '<%= app_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * 'jshint' defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in 'options'. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside 'src/'.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      // These are the templates from 'src/app'.
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= app_files.appTemplates %>'],
        dest: '<%= pkg.deployRoot %><%= dist_dir %>/templates-app.js'
      },

      // These are the templates from 'src/common'.
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.commonTemplates %>'],
        dest: '<%= pkg.deployRoot %><%= dist_dir %>/templates-common.js'
      }
    },

    /**
     * The 'index' task compiles the 'index.html' file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have to wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the '<head>' of 'index.html'. The
       * 'src' property contains the list of included files.
       */
      build: {
        dir: '<%= pkg.deployRoot %><%= dist_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= pkg.deployRoot %><%= dist_dir %>/src/**/*.module.js',
          '<%= pkg.deployRoot %><%= dist_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= pkg.deployRoot %><%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= pkg.deployRoot %><%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= concat.compile_css.dest %>'
        ]
      }
    },

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          bases: ['<%= pkg.deployRoot %>/dist/']
        }
      }
    },

    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: './karma-unit.js'
      },
      unit: {
        runnerPort: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= dist_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       * We also want to copy vendor files and rebuild index.html in case
       * vendor_files.js was altered (list of 3rd party vendor files installed by bower)
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile', 'clean:vendor', 'copy:build_vendorjs', 'copy:build_vendorjs_map', 'copy:build_vendorcss', 'index:build'],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs', 'index:build']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:build_app_assets']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      html_assets: {
        files: [
          '<%= app_files.htmlFiles %>'
        ],
        tasks: ['copy:build_html_assets']
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.appTemplates %>',
          '<%= app_files.commonTemplates %>'
        ],
        tasks: ['html2js']
      },

      bootstrap_less2json: {
        files: ['src/less/custom/variables.less'],
        tasks: ['bootstrap_less2json']
      },
      bootstrap_json2less: {
        files: ['src/less/bootstrap/config.json'],
        tasks: ['bootstrap_json2less']
      },
      /*'<%= dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'  */

      /**
       * When the Less files change, we need to compile them to CSS and minify them.
       */
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:build', 'concat:build_css', 'copy:build_vendor_assets',
          'copy:build_vendorcss','less:compile','copy:compile_assets', 'concat:compile_css']
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: ['jshint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      }
    }
  };

  //console.log('deployRoot: ' + fileConfig.deployRoot, 'full_path: ', path.resolve());
  /** ********************************************************************************* */
  /** **************************** Project Configuration ****************************** */
  grunt.initConfig(_.extend(taskConfig, fileConfig));

  // In order to make it safe to just compile or copy *only* what was changed,
  // we need to ensure we are starting from a clean, fresh build. So we rename
  // the 'watch' task to 'delta' (that's why the configuration var above is
  // 'delta') and then add a new task called 'watch' that does a clean build
  // before watching for changes.
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'karma:unit', 'express', 'open', 'delta']);

  // The default task is to build and compile.
  grunt.registerTask('default', ['build']);

  grunt.registerTask('serve', 'Begins the express server and opens it in a browser',
      ['build', 'karma:unit', 'express', 'open', 'delta']);

  // The 'build' task gets your app ready to run for development and testing.
  grunt.registerTask('build', [
    'clean:all', 'html2js', 'jshint', 'less:build', 'concat:build_css', 'copy:build_appico',  'copy:build_html_assets',
    'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendorcss', 'copy:build_appjs',
    'copy:build_vendorjs', 'copy:build_vendorjs_map', 'ngAnnotate:build', 'index:build', 'karmaconfig', 'karma:continuous','less:compile',
    'copy:compile_assets', 'copy:compile_ico', 'concat:compile_js', 'copy:compile_jsmap', 'concat:compile_css', 'uglify', 'index:compile'
  ]);

  // The 'compile' task gets your app ready for deployment by concatenating and minifying your code.
  // Note - compile builds off of the build dir (look at concat:compile_js), so run grunt build before grunt compile
  grunt.registerTask('compile', [
    'less:compile', 'copy:compile_assets', 'concat:compile_js', 'copy:compile_jsmap', 'uglify', 'index:compile'
  ]);

  // A utility function to get all app JavaScript sources.
  function filterForJS (files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  // A utility function to get all app CSS sources.
  function filterForCSS (files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }

  // The index.html template includes the stylesheet and javascript sources
  // based on dynamic names calculated in this Gruntfile. This task assembles
  // the list into variables for the template to use and then runs the
  // compilation.
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^(' + grunt.config('deployRoot') + grunt.config('dist_dir') + '|' +
        grunt.config('deployRoot') + grunt.config('compile_dir') + ')\/', 'g');

    // this.fileSrc comes from either build:src, compile:src, or karmaconfig:src in the index config defined above
    // see - http://gruntjs.com/api/inside-tasks#this.filessrc for documentation
    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    // this.data.dir comes from either build:dir, compile:dir, or karmaconfig:dir in the index config defined above
    // see - http://gruntjs.com/api/inside-tasks#this.data for documentation
    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        // These are the variables looped over in our index.html exposed as "scripts", "styles", and "version"
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version'),
            author: grunt.config('pkg.author'),
            date: grunt.template.today('yyyy')
          }
        });
      }
    });
  });

  // In order to avoid having to specify manually the files needed for karma to
  // run, we use grunt to manage the list for us. The 'karma/*' files are
  // compiled as grunt templates for use by Karma. Yay!
  //console.log('deployRoot - config?:', grunt.config('deployRoot'));
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy('karma/karma-unit.js.tpl', './karma-unit.js', {
      process: function (contents, path) {
        //console.log('inside copy karma-unit.tpl.js... - path: ' + path);
        // This is the variable looped over in the karma template of our index.html exposed as "scripts"
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });
};
