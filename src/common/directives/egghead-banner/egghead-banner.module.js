'use strict';

(function (module) {
  module.directive('eggheadBanner', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/egghead-banner/egghead-banner.tpl.html',
      scope: { title: '@' }
    };
  });
}(angular.module('egghead-banner', [
  'templates-common'
])));
