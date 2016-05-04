'use strict';

if (String.prototype.includes === undefined) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}
