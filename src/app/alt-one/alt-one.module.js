'use strict';

(function (module) {
  module.config(function ($stateProvider) {
    $stateProvider.state('app.alt-one', {
      url: 'alt-one',
      views: {
        'content@': {
          templateUrl: 'alt-one/alt-one.content.tpl.html',
          controller: 'AltOneContentController'
        }
      }
    });
  });

  module.controller('AltOneContentController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      console.log('AltOneContentController - $state:', $state, '$rootScope: ', $rootScope);
    }
  ]);
}(angular.module('app.alt-one', [
  'ui.router'
])));
