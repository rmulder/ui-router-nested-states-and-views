module.exports = function ( karma ) {
    karma.set({
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: './',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
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
                'vendor/angular-animate/angular-animate.min.js',
                'vendor/angular-messages/angular-messages.min.js',
                'vendor/angular-touch/angular-touch.min.js',
                'vendor/lodash/lodash.min.js',
                'vendor/angular-ui-utils/ui-utils.min.js',
                'vendor/ng-currency/dist/ng-currency.min.js',
                './dist/templates-app.js',
                './dist/templates-common.js',
                'vendor/angular-mocks/angular-mocks.js',
                
            'src/**/*.module.js',
            'src/**/*.js',
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher' ],
    preprocessors: {
    },

    /**
     * How to report, by default.
     */
    reporters: 'dots',

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

            /**
            * Disable file watching by default.
            */
            autoWatch: false,

            /**
            * The list of browsers to launch to test on. This includes only "Firefox" by
            * default, but other browser names include:
            * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
            *
            * Note that you can also use the executable name of the browser, like "chromium"
            * or "firefox", but that these vary based on your operating system.
            *
            * You may also leave this blank and manually navigate your browser to
            * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'Firefox'
    ]
  });
};

