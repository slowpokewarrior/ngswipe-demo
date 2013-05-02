'use strict';

describe('Service: localData', function () {

  // load the service's module
  beforeEach(module('ngswipeDemoApp'));

  // instantiate service
  var localData, oldOpenDatabase, openDatabase, win;
  beforeEach(inject(function (_localData_, $injector, $window, $rootScope) {
    win = $window;
    localData = _localData_;

    oldOpenDatabase = openDatabase;
    win.openDatabase = function () {
      var fakeTx = {
        executeSql: function (query, vars, callback) {
          if (query.indexOf('SELECT') === 0) {
            if (vars.indexOf('foo') === 0) {
              callback(fakeTx, [{value: 'bar'}]);
            }
            
          }
        }
      };

      return {
        transaction: function (fn) {
          return fn(fakeTx);
        }
      }
    }
  }));

  afterEach(function ($window) {
    win.openDatabase = oldOpenDatabase
  });

  it('should select a single item when calling getItem', inject(function ($rootScope) {
    var foo;

    localData.getItem('foo').then(function (result) {
      foo = result;
    });  
    
    $rootScope.$digest();

    expect(foo).toEqual('bar');
  }));
});