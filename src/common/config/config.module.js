'use strict';

var APP = APP || {};
angular.module('app.config', ['app.namespace'])
  .value('appValues', {
    currentPage: '',
    alerts: [],
    models: {},
    vm: {}
  })
  .constant('appModels', (function() {
    var appModels = {
      APPLICATION_OBJECT: 'Application__c',
      APPLICATION2_OBJECT: 'Application2__c',
      EMPLOYMENT_OBJECT: 'Employment_Information__c',
      IDENTITY_OBJECT: 'Identity_Information__c',
      ABOUT_ACCOUNT_OBJECT: 'About_Account__c',
      CROSS_SELL_LOGIC_OBJECT: 'Cross_Sell_Logic__c',
      CUSTOMER_OBJECT: 'Customer__c',
      DOCUSIGN_CONFIG_OBJECT: 'Docusign_Config__c',
      APPLICATION_CONFIGURATION_OBJECT: 'Application_Configuration__c',
      APPLICATION_ACTIVITY_OBJECT: 'Application_Activity__c'
    };

    return appModels;
  })())
  .constant('appConstants', (function () {
    var appConstants = angular.extend({
      id: null,
      ut: null,
      debug: true,
      channel: 'Online',
      controller: null,
      namespace: '',
      serviceCallMethods: {
        'getAppFields': {
          local: 'get-app-fields',
          remote: 'getAppFields'
        },
        'getVehicleMakes':{
          local: 'get-vehicle-makes',
          remote: 'bringVehicleMakes'
        },
        'getVehicleModels':{
          local: 'get-vehicle-models',
          remote: 'bringVehicleModels'
        },
        'getVehicleSubModels':{
          local: 'get-vehicle-submodels',
          remote: 'bringVehicleSubModels'
        },
        'callExternalMethod': {
          local: {
            'ProductApplicationStatus': 'get-product-application-status'
          },
          remote: 'callExternalMethod'
        },
        'getCountiesByState': {
          local: 'get-counties-by-state',
          remote: 'getCountiesByState'
        }
      },
      loadingImage:'assets/images/loading-image.gif',
      errorKeys: ['server-errors', 'debug-server-errors', 'server-errors-stack-trace', 'err_message'],
      debugErrorKeys: ['debug-server-errors', 'server-errors-stack-trace'],
      notesObjectKeys: ['pageFields', 'status', 'extensionClass'],
      notesListKeys: ['fieldsToDisplay'],
      jsonDataKeys: ['pageFields']
    }, APP);
    //console.log('appConstants:namespace.APP:', APP);
    //console.log('appConstants: ', appConstants);
    return appConstants;
  })())
  .factory('appConfig', ['appValues', 'appModels', 'appConstants',
    function (appValues, appModels, appConstants) {
      return {
        appValues: appValues,
        appModels: appModels,
        appConstants: appConstants
      };
    }
  ]);
