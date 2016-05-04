'use strict';

// this is the concatenated source from the video
// and includes the HTML partials as javascript objects.
(function ( window, angular, undefined ) {

  (function(app) {
    app.config([
      '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
          url: '/',
          views: {
            'header': {
              templateUrl: 'templates/header.tpl.html'
            },
            'sidebar': {
              templateUrl: 'templates/sidebar.tpl.html'
            },
            'content': {
              templateUrl: 'templates/content.tpl.html'
            },
            'footer': {
              templateUrl: 'templates/footer.tpl.html'
            }
          }
        });
        $urlRouterProvider.otherwise('/');
      }
    ]);

    app.controller('AppController', ['$scope', '$rootScope', '$state',
      function ($scope, $rootScope, $state) {
        console.log('Global AppController - $state:', $state, '$rootScope: ', $rootScope);
        $scope.$state = $state;
      }
    ]);

  }(angular.module('app', [
    'app.namespace',
    'app.config',
    'app.services',
    'app.alt-one',
    'app.alt-two',
    'app.alt-three',
    'templates-app',
    'templates-common',
    'ui.router'
  ])));

  angular.module('blink', []).directive('blink', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: [
          '$scope',
          '$element',
          function ($scope, $element) {
            var opacity = '0.0';
            function toggleOpacity() {
              opacity = (opacity === '1.0') ? '0.0' : '1.0';
              $element.css('opacity', opacity);
              $timeout(toggleOpacity, 400);
            }
            toggleOpacity();
          }
        ],
        template: '<span ng-transclude></span>',
        replace: true
      };
    }
  ]);

})( window, window.angular );
