'use strict';
/*jshint bitwise: false*/
var _ = _ || {}, DSP = DSP || {};

angular.module('app.directives', []);
angular.module('app.directives')
  .directive('showAttrs', function() {
    return function(scope, el, attrs) {
      var pre = document.createElement('pre');
      el.after(pre);
      scope.$watch(function() {
        var attrs = {};
        Array.prototype.slice.call(el[0].attributes, 0).forEach(function(item) {
          if (item.name !== 'show-attrs') {
            attrs[item.name] = item.value;
          }
        });
        return attrs;
      }, function(newAttrs, oldAttrs) {
        pre.innerText = JSON.stringify(newAttrs, null, 2);
      }, true);
    };
  });
