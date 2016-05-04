'use strict';

(function (module) {
  module.config(function ($stateProvider) {
    $stateProvider.state('app.alt-one', {
      url: 'alt-one',
      views: {
        'content@': {
          templateUrl: 'alt-one/alt-one.content.tpl.html'
        }
      }
    });
  });
}(angular.module('app.alt-one', [
  'ui.router'
])));
