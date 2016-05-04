'use strict';

angular.module('app.namespace', [])
  .factory('namespace', [function() {
    var DSP = DSP || {};
    return {
      DSP: DSP
    };
  }]);
