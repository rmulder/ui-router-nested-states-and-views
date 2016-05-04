'use strict';

(function (module) {
  module.config(function ($stateProvider) {
    $stateProvider.state('app.alt-three', {
      url: 'alt-three',
      views: {
        'content@': {
          templateUrl: 'alt-three/alt-three.content.tpl.html',
          controller: 'AltThreeContentController'
        },
        'header@': {
          templateUrl: 'alt-three/alt-three.header.tpl.html'
        },
        'one@app.alt-three': {
          template: '<div class="alert-info">Sub One</div>',
          controller: 'OneController'
        },
        'two@app.alt-three': {
          template: '<div class="alert-success">Sub Two</div>',
          controller: 'TwoController'
        }
      }
    });
  });

  module.controller('AltThreeContentController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      console.log('AltThreeContentController - $state:', $state, '$rootScope: ', $rootScope);
    }
  ]);

  module.controller('OneController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      console.log('OneController - $state:', $state, '$rootScope: ', $rootScope);
    }
  ]);

  module.controller('TwoController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      console.log('TwoController - $state:', $state, '$rootScope: ', $rootScope);
    }
  ]);
}(angular.module('app.alt-three', [
  'ui.router',
  'blink'
])));
