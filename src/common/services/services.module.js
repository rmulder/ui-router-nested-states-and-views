'use strict';
/*jshint bitwise: false*/
var _ = _ || {}, APP = APP || {}, dataLayer = dataLayer || [];
angular.module('app.services', ['app.config'])
  .factory('serverService', ['$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function ($http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      var arrayParamsToString = function(params) {
        if (_.isObject(params)|| _.isArray(params)) {
          _.each(params, function (val, idx) {
            if (_.isArray(val)) {
              params[idx] = val.join(';');
            }
          });
        }

        return params;
      };

      var callServerMethod = function (controller, method, params, pageName, callback) {
        try {
          params = arrayParamsToString(params);
          if (pageName === undefined) {
            controller[method](params, function (results, event) {
              $log.info('callServerMethod (no pageName): ' + method + ' event:', event);
              if (event.status) {
                if (results === null) {
                  $log.info('null results from server - session is expired!');
                }

                callback(results);
                return true;
              } else {
                $log.log('Error contacting server: ' + event.message, 'event:', event);
              }

              return false;
            }, {timeout: 120000});
          } else {
            controller[method](params, pageName, function (results, event) {
              $log.info('callServerMethod: ' + method + ' on pageName: ' + pageName + ' event:', event);
              if (event.status) {
                if (results === null) {
                  //TODO: Must fix - we hit this on the server from an expired session. Find a solution.
                  $log.info('null results from server - session is expired!');
                }

                callback(results);
                return true;
              } else {
                $log.log('Error contacting server: ' + event.message, 'event:', event);
              }

              return false;
            }, {timeout: 120000});
          }
        } catch (e) {
          $log.log('An error has occurred: ' + e.message, e.stack);
          return false;
        }
      };

      var removeNamespacePrefix = function(results, appConfig) {
        if (APP.debug) {$log.info('called removeNamespacePrefix!');}
        var models = Object.keys(_.invert(appConfig.appModels)), model, field, modelObj, newResults = {},
            res = angular.merge({}, results), objKeys = Object.keys(results);
        if (APP.debug) {
          $log.info('models:', models, 'object keys:', objKeys);
          $log.info('results - before model changes:', res);
        }

        _.each(results, function (obj, key) {
          if (_.isString(key) && key.indexOf(appConfig.appConstants.namespace) > -1) {
            model = key.substr(key.indexOf(appConfig.appConstants.namespace) + appConfig.appConstants.namespace.length);
          } else {
            model = key;
          }

          if (APP.debug) {$log.info('model:', model, 'obj:', obj);}
          if (models.indexOf(key) > -1 || !isNaN(parseInt(key, 10))) {
            if (_.isObject(obj)) {
              modelObj = {};
              _.each(obj, function (fval, fname) {
                //$log.info('removeNamespacePrefix - field: ' + key + '.' + fname + '; fval: ', fval);
                if (fname.indexOf(appConfig.appConstants.namespace) > -1) {
                  field = fname.substr(fname.indexOf(appConfig.appConstants.namespace) +
                      appConfig.appConstants.namespace.length);
                } else {
                  field = fname;
                }

                modelObj[field] = fval;
              });

              if (APP.debug) {$log.info('modelObj:', modelObj);}
              //$log.info('removeNamespacePrefix - model: ' + model + '; modelObj:', modelObj);
              newResults[model] = modelObj;
            }
          } else {
            newResults[key] = obj;
          }
        });

        return newResults;
      };

      var preProcessResults = function (results, $rootScope, appConfig, $location, params, request) {
        var pageFields = {};
        if (APP.debug) {$log.info('inside preProcessResults:', results);}
        $rootScope.displayFields = {};
        _.each(appConfig.appConstants.errorKeys, function (key) {
          if (results[key]) {
            if (APP.debug) {$log.info('Found error for key: ' + key, results[key]);}
            var errors = results[key];
            if (errors['Body']) {
              errors = errors['Body'];
            }

            if (APP.debug) {$log.info('errors:', errors);}
            var alerts = errors.split(/(?:\r\n|\r|\n)/), msg;
            _.each(alerts, function (alert) {
              if (alert.length > 0) {
                msg = {type: 'danger', msg: alert, key: key};
                if (params['field']) {
                  msg.field = params['field'];
                }

                if (appConfig.appConstants.debugErrorKeys.indexOf(key) > -1) {
                  $rootScope.debugErrors.push(msg);
                } else {
                  $rootScope.alerts.push(msg);
                }
              }

            });

            delete results[key];
          }
        });

        if ($rootScope.alerts && $rootScope.alerts.length > 0) {
          $log.info('Errors:', $rootScope.alerts);
        }

        _.each(appConfig.appConstants.notesObjectKeys, function (key) {
          if (results[key]) {
            var note = results[key], noteCopy, noteCopyTmp, noteCopyTmp2, noteCopyBefore;
            if (note['Body']) {
              note = note['Body'];
            }

            if (appConfig.appConstants.notesListKeys.indexOf(key) > -1) {
              appConfig.appValues[key] = note.split(';');
            }

            if (appConfig.appConstants.jsonDataKeys.indexOf(key) > -1) {
              note = _.unescape(note);
              note = JSON.parse(note);
              noteCopyBefore = angular.merge({}, note);
              //$log.info('parsed noteCopy json - before:', noteCopyBefore);

              if (key === 'pageFields') {
                noteCopyTmp2 = $rootScope.fixPageFields(note.fields);
                //$log.info('fields - after fixPageFields:', noteCopyTmp2);
                noteCopyTmp = angular.merge([], noteCopyTmp2);
                noteCopyTmp = $rootScope.fixJSONFields(noteCopyTmp);
                note.fields = noteCopyTmp;
              }

              noteCopy = angular.merge({}, note);
              $log.info('parsed noteCopy json - after fixJSONFields:', noteCopy);
              if (key === 'pageNotes') {
                _.each(note, function (pNote) {
                  if (pNote.Field_Name__c) {
                    appConfig.appValues.fieldNotes[pNote.Field_Name__c] = pNote;
                  }
                });
              }
            }

            if (key === 'pageFields') {
              _.each(note, function (val, idx) {
                //$log.info('idx: ' + idx, '; val:', val);
                appConfig.appValues[idx] = angular.merge({}, val);
              });
              results['pageFields'] = note;
              pageFields['fields'] = angular.copy(note);
            } else {
              appConfig.appValues[key] = note;
              results[key] = note;
            }
          }
        });

        if (!results['pageFields']) {
          if (results['fields']) {
            pageFields['fields'] = angular.copy(results['fields']);
          }
          if (results['labels']) {
            pageFields['labels'] = angular.copy(results['labels']);
          }
        }
        $log.info('pageFields data before second call to fixJSONFields: ', pageFields);

        if (results['fields']) {
          //$log.info('results[fields]:', results['fields']);
          //pre-process any raw fields here:
          var fields = angular.copy(results['fields']), fields2, fixedFields = angular.copy(fields), fixedFields2;
          //$log.info('fields - before fixPageFields:', fields);
          fixedFields = $rootScope.fixPageFields(fixedFields);
          //$log.info('fields - after fixPageFields:', fixedFields);
          fixedFields2 = angular.merge([], fixedFields);
          fixedFields2 = $rootScope.fixJSONFields(fixedFields2);
          //$log.info('fields - after fixJSONFields:', fixedFields2);
          fields = angular.merge([], fixedFields2);
          //fields = $rootScope.processJSONFields(fields);
          //$log.info('updated fields after call to fixJSONFields:', {fields: fields});
          fields2 = angular.merge([], fields);
          results['fields'] = fields2;
          pageFields['fields'] = angular.copy(results['fields']);
        }

        $log.info('pageFields data after second call to fixJSONFields: ', pageFields);

        //$log.info('appConfig.appConstants.multiSelectFields:', appConfig.appConstants.multiSelectFields);
        _.each(appConfig.appConstants.multiSelectFields, function(fld) {
          var fldArray = fld.split('.'), obj = fldArray[0], key = fldArray[1];
          //$log.info('obj: ' + obj, 'key: ' + key, 'results[obj]: ', results[obj]);
          if (obj && key && results[obj] && _.isObject(results[obj])) {
            if (results[obj].hasOwnProperty(key)) {
              results[obj][key] = results[obj][key].split(';');
            }
          }
        });

        APP.results = angular.merge({}, results);
        if (request === 'getAppFields') {
          if (appConfig.appConstants.controller === null) {
            results = angular.merge(appConfig.appValues.models, results);
          }

          //console.log('appConfig.appConstants.controller:', appConfig.appConstants.controller, 'results:', results);
          angular.extend(appConfig.appValues.models, results);
        }

        if (APP.debug) {$log.info('preProcessResults: results:', angular.merge({}, results));}
        return results;
      };

      var setQueryParams = function(params, appConfig) {
        params.channel = appConfig.appConstants.channel;
        params.id = appConfig.appConstants.id;
        params.ut = appConfig.appConstants.ut;
        params.debug = (appConfig.appConstants.debug)? true : false;

        if (APP.debug) {$log.info('initial query params to send to backend:', params);}
      };

      var factory = function (request, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
                              local_callback, remote_callback) {
        return {
          query: function (tmpParams) {
            var deferred = $q.defer(), params = _.clone(tmpParams || {}), attrname, obj, pos,
                pageName = $state.current.pageName || 'GetStartedPage';

            if (APP.debug) {$log.info('query params - before:', params);}
            setQueryParams(params, appConfig);
            if (APP.debug) {$log.info('query params - after setQueryParams:', params);}
            if (params.hasOwnProperty('pageName')) {
              pageName = params['pageName'];
              delete params['pageName'];
            }

            _.each(appConfig.appConstants.errorKeys, function (key) {
              if (params[key]) {
                delete params[key];
              }
            });

            _.each(appConfig.appConstants.readOnlyObjects, function (key) {
              if (params[key]) {
                delete params[key];
              }
            });

            _.each(appConfig.appConstants.localDataKeys, function (key) {
              //$log.info('localDataKey: ' + key);
              if (params[key]) {
                if (APP.debug) {$log.info('Deleting localDataKey: ' + key);}
                delete params[key];
              }

              pos = key.indexOf('.*');
              if (pos > -1) {
                obj = key.substr(0, pos);
                for (attrname in params) {
                  if (params.hasOwnProperty(attrname)) {
                    if (attrname.indexOf(obj) > -1) {
                      delete params[attrname];
                    }
                  }
                }
              }
            });

            $log.info('Before method call: ' + request + '; for page: ' + pageName, 'cloned params:', _.clone(params));
            if (APP.debug) {$log.info('appConfig:', appConfig);}
            if (appConfig.appConstants.controller === null) {
              var path = 'assets/services/', page, productPage;
              try {
                if (appConfig.appConstants.serviceCallMethods[request].local !== null) {
                  if (_.isObject(appConfig.appConstants.serviceCallMethods[request].local) && params['extensionClass']) {
                    page = appConfig.appConstants.serviceCallMethods[request].local[params['extensionClass']];
                  } else {
                    page = appConfig.appConstants.serviceCallMethods[request].local + '-' +
                        appConfig.appPagesRoutes[appConfig.appValues.currentPage].toLowerCase();
                  }

                  productPage = page;
                  if (APP && APP.product) {
                    productPage = page + '-' + APP.product.replace(' ', '-').toLowerCase();
                  }

                  if (APP.debug) {$log.info('appConfig.appConstants.models:', appConfig.appConstants.models);}
                  //$log.info('currentPage:', appConfig.appValues.currentPage, 'appConfig:', appConfig, 'page:' + page,
                  //  'productPage:' + productPage, 'currentRoute:', appConfig.appPagesRoutes[appConfig.appValues.currentPage]);
                  if (APP.debug) {$log.info('query.local.params:', params);}
                  $http({method: 'GET', url: path + productPage + '.json'})
                    .success(function (results) {
                      var tmp = angular.merge({}, results);
                      $log.info('query local results:', tmp);
                      results = preProcessResults(results, $rootScope, appConfig, $location, request);
                      $timeout(function () {
                        if (local_callback) {
                          results = local_callback(params, results);
                          deferred.resolve(results);
                        } else {
                          deferred.resolve(results);
                        }
                      }, 1000);
                    })
                    .error(function () {
                      //$log.info('Error!' + path + page + '-' + APP.product.replace(' ', '-').toLowerCase() + '.json not found!');
                      $http.get(path + page + '.json')
                        .success(function (results) {
                          //$log.info('query local results:', results);
                          results = preProcessResults(results, $rootScope, appConfig, $location, request);
                          $timeout(function () {
                            if (local_callback) {
                              results = local_callback(params, results);
                              deferred.resolve(results);
                            } else {
                              deferred.resolve(results);
                            }
                          }, 1000);
                        })
                        .error(function (results, status, headers, config) {
                          if (results.status === 404) {
                            $log.info('Error condition hit');
                          }
                          // called asynchronously if an error occurs or server returns response with an error status.
                          $timeout(function () {
                            results = {};
                            if (local_callback) {
                              results = local_callback(params, results);
                              deferred.resolve(results);
                            } else {
                              deferred.resolve(results);
                            }
                          }, 500);
                        });
                    });
                } else {
                  //return dummy data
                  $timeout(function () {
                    var results = {};
                    if (local_callback) {
                      results = local_callback(params, results);
                    }
                    $rootScope.$apply(function () {
                      deferred.resolve(results);
                    });
                  }, 1000);
                }
              } catch (e) {
                $log.info('Error getting ' + page, e);
                deferred.resolve(null);
              }
            } else {
              if (appConfig.appConstants.serviceCallMethods[request].remote !== null) {
                callServerMethod(appConfig.appConstants.controller,
                    appConfig.appConstants.serviceCallMethods[request].remote,
                    params, pageName, function (results) {
                  //$log.info('callServerMethod results:', results);
                  if (results) {
                    results = preProcessResults(results, $rootScope, appConfig, $location, params, request);
                  }

                  if (remote_callback) {
                    results = remote_callback(params, results);
                  }

                  //console.log('results from backend: ', results);
                  $rootScope.$apply(function () {
                    deferred.resolve(results);
                  });
                });
              }
            }

            return deferred.promise;
          },
          get: function (tmpParams) {
            var deferred = $q.defer(), field = '', params = _.clone(tmpParams || {}), pageName = null;
            if (_.isObject(params)) {
              if (params.field) {
                field = params.field;
                $log.info('field: ' + field);
              }

              setQueryParams(params, appConfig);
              if (params.hasOwnProperty('pageName')) {
                pageName = params['pageName'];
                delete params['pageName'];
              }
            } else {
              pageName = undefined;
            }

            $rootScope.resetAlerts(field);
            $log.info('Before server call - method/request:', request, 'params:', params, 'appConfig:', appConfig);
            if (appConfig.appConstants.controller === null) {
              var page;
              try {
                if (appConfig.appConstants.serviceCallMethods[request].local !== null) {
                  if (_.isObject(appConfig.appConstants.serviceCallMethods[request].local) && params['extensionClass']) {
                    page = appConfig.appConstants.serviceCallMethods[request].local[params['extensionClass']];
                  } else {
                    page = appConfig.appConstants.serviceCallMethods[request].local;
                  }

                  //$log.info('currentPage:', appConfig.appValues.currentPage, 'appConfig:', appConfig, 'page:' + page,
                  //  'currentRoute:', appConfig.appPagesRoutes[appConfig.appValues.currentPage]);
                  $http.get('assets/services/' + page + '.json')
                    .success(function (results) {
                      $log.info('get local results:', results);
                      $timeout(function () {

                        if (local_callback) {
                          results = local_callback(params, results);
                          deferred.resolve(results);
                        } else {
                          deferred.resolve(results);
                        }
                      }, 500);
                    })
                    .error(function (results, status, headers, config) {
                      if (results.status === 404) {
                        $log.info('Error condition hit');
                      }
                      // called asynchronously if an error occurs or server returns response with an error status.
                      $timeout(function () {
                        results = {};
                        if (local_callback) {
                          results = local_callback(params, results);
                          deferred.resolve(results);
                        } else {
                          deferred.resolve(results);
                        }
                      }, 500);
                    });
                } else {
                  //return dummy data
                  $timeout(function () {
                    var results = {};
                    if (local_callback) {
                      results = local_callback(params, results);
                    }
                    $rootScope.$apply(function () {
                      deferred.resolve(results);
                    });
                  }, 1000);
                }
              } catch (e) {
                $log.info('Error getting ' + page, e);
                deferred.resolve(null);
              }
            } else {
              if (appConfig.appConstants.serviceCallMethods[request].remote !== null) {
                $log.info('get:' + request + ' remote - params: ', params);
                callServerMethod(appConfig.appConstants.controller,
                    appConfig.appConstants.serviceCallMethods[request].remote, params, pageName, function (results) {
                  if (results === null) {
                    $location.path('/session-expired').replace();
                  } else {
                    if (pageName !== undefined) {
                      results = _.unescape(results);
                      results = JSON.parse(results);
                    }

                    if (remote_callback) {
                      results = remote_callback(params, results);
                    }
                  }

                  $rootScope.$apply(function () {
                    deferred.resolve(results);
                  });
                });
              }
            }

            return deferred.promise;
          },
          fetch: function (id) {
            var deferred = $q.defer();
            $rootScope.resetAlerts();
            //$log.info('fetch: Before server call - method/request:', request, 'id:', id, 'appConfig:', appConfig);
            if (appConfig.appConstants.controller === null) {
              var page = appConfig.appConstants.serviceCallMethods[request].local;
              //$log.info('page:' + page);
              $http.get('assets/services/' + page + '.json')
                .success(function (results) {
                  $log.info('fetch local results:', results);
                  $timeout(function () {
                    if (local_callback) {
                      results = local_callback({id: id}, results);
                      deferred.resolve(results);
                    } else {
                      deferred.resolve(results);
                    }
                  }, 500);
                })
                .error(function (results, status, headers, config) {
                  if (results.status === 404) {
                    $log.info('Error condition hit');
                  }
                  // called asynchronously if an error occurs or server returns response with an error status.
                  $timeout(function () {
                    results = {};
                    if (local_callback) {
                      results = local_callback({id: id}, results);
                      deferred.resolve(results);
                    } else {
                      deferred.resolve(results);
                    }
                  }, 500);
                });
            } else {
              if (appConfig.appConstants.serviceCallMethods[request].remote !== null) {
                $log.info('fetch:' + request + ' remote - id: ', id);
                callServerMethod(appConfig.appConstants.controller,
                    appConfig.appConstants.serviceCallMethods[request].remote, id, undefined, function (results) {
                  if (results === null) {
                    $location.path('/session-expired').replace();
                  }

                  if (remote_callback) {
                    results = remote_callback({id: id}, results);
                  }

                  $rootScope.$apply(function () {
                    deferred.resolve(results);
                  });
                });
              }
            }

            return deferred.promise;
          }
        };
      };

      return {
        callServerMethod: callServerMethod,
        preProcessResults: preProcessResults,
        factory: factory
      };
    }
  ])
  .factory('getAppFields', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('getAppFields', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          //$log.info('inside getAppFields - local results:', results);
          var tmp = {};
          if (!results['pageFields']) {
            if (results['labels']) {
              tmp.labels = results['labels'];
              delete results['labels'];
            }

            if (results['fields']) {
              tmp.fields = results['fields'];
              delete results['fields'];
            } else {
              tmp.fields = [];
            }

            if (!_.isEmpty(tmp)) {
              results.pageFields = tmp;
            }
          }

          return results;
        }, function (params, results) {
          //$log.info('inside getAppFields - remote results:', results);
          if (!results['pageFields']) {
            results['pageFields'] = {fields: []};
          }

          return results;
        }
      );
    }
  ])
  .factory('getVehicleMakes', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('getVehicleMakes', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          //$log.info('inside getVehicleMakes - local results:', results);
          return results;
        },
        function (params, results) {
          //$log.info('inside getVehicleMakes - remote results:', results);
          return results;
        }
      );
    }
  ])
  .factory('getVehicleModels', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('getVehicleModels', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          //$log.info('inside getVehicleModels - local results:', results);
          return results;
        },
        function (params, results) {
          //$log.info('inside getVehicleModels - remote results:', results);
          return results;
        }
      );
    }
  ])
  .factory('getVehicleSubModels', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('getVehicleSubModels', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          //$log.info('inside getVehicleSubModels - local results:', results);
          return results;
        },
        function (params, results) {
          //$log.info('inside getVehicleSubModels - remote results:', results);
          return results;
        }
      );
    }
  ])
  .factory('callExternalMethod', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('callExternalMethod', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          //$log.info('inside callExternalMethod - local results:', results);
          return results;
        },
        function (params, results) {
          //$log.info('inside callExternalMethod - remote results:', results);
          return results;
        }
      );
    }
  ])
  .factory('getCountiesByState', ['serverService', '$http', '$q', '$rootScope', '$state', 'appConfig', '$timeout', '$location', '$log',
    function (serverService, $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log) {
      return serverService.factory('getCountiesByState', $http, $q, $rootScope, $state, appConfig, $timeout, $location, $log,
        function (params, results) {
          if (APP.debug) {$log.info('inside callExternalMethod - local results:', results);}
          return results;
        },
        function (params, results) {
          if (APP.debug) {$log.info('inside callExternalMethod - remote results:', results);}
          return results;
        }
      );
    }
  ]);
