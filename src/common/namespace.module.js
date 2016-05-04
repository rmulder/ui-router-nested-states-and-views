'use strict';

angular.module('app.namespace', [])
  .factory('namespace', [function() {
    var APP = APP || {};
    return {
      APP: APP
    };
  }]);
