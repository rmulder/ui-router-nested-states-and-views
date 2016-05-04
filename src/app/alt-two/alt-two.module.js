'use strict';

(function (module) {
  module.config(function ($stateProvider) {
    $stateProvider.state('app.alt-two', {
      url: 'alt-two',
      views: {
        'content@': {
          templateUrl: 'alt-two/alt-two.content.tpl.html',
          controller: 'AltTwoContentController'
        },
        'header@': {
          templateUrl: 'alt-two/alt-two.header.tpl.html'
        }
      }
    });
  });

  module.controller('AltTwoContentController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      console.log('AltTwoContentController - $state:', $state, '$rootScope: ', $rootScope);
    }
  ]);
}(angular.module('app.alt-two', [
  'ui.router'
])));
