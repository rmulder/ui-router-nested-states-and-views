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
        console.log('AppController - $state:', $state, '$rootScope: ', $rootScope);
        $scope.$state = $state;
      }
    ]);

  }(angular.module('ui-router-named-views', [
    'ui-router-named-views.alt-one',
    'ui-router-named-views.alt-two',
    'ui-router-named-views.alt-three',
    'egghead-banner',
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

  angular.module('templates-app', ['alt-one/alt-one.content.tpl.html', 'alt-three/alt-three.content.tpl.html', 'alt-three/alt-three.header.tpl.html', 'alt-two/alt-two.content.tpl.html', 'alt-two/alt-two.header.tpl.html', 'common/content.tpl.html', 'common/footer.tpl.html', 'common/header.tpl.html', 'common/sidebar.tpl.html']);

  angular.module('templates-common', ['directives/egghead-banner/egghead-banner.tpl.html']);

})( window, window.angular );
