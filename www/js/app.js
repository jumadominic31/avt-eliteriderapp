// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers','ngAnimate', 'ngStorage', 'angular-barcode'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('httpAuthInterceptor', function ($q) {
  return {
    'responseError': function (response) {
      // NOTE: detect error because of unauthenticated user
      if ([401, 403].indexOf(response.status) >= 0) {
        // redirecting to login page
        // var alertPopup = $ionicPopup.alert({
        //     title: 'Session expired',
        //     template: '<center>Please log in again</center>'
        // });
        window.location ="#/app/browse";
        return response;
      } else {
        return $q.reject(rejection);
      }
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpAuthInterceptor');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.browse', {
    url: '/browse',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html',
        controller: 'BrowseCtrl'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        }
    }
  })

  .state('app.listpickups', {
    url: '/listpickups',
    views: {
        'menuContent': {
          templateUrl: 'templates/listpickups.html',
          controller: 'ListPickupsCtrl'
        }
    }
  })

  .state('app.listdrops', {
    url: '/listdrops',
    views: {
        'menuContent': {
          templateUrl: 'templates/listdrops.html',
          controller: 'ListDropsCtrl'
        }
    }
  })

  .state('app.create', {
    url: '/create',
    views: {
        'menuContent': {
          templateUrl: 'templates/create.html',
          controller: 'CreateCtrl'
        }
    }
  })

  .state('app.confirmcreate', {
    url: '/confirmcreate',
    views: {
        'menuContent': {
          templateUrl: 'templates/confirmcreate.html',
          controller: 'ConfirmCreateCtrl'
        }
    }
  })

  .state('app.printawb', {
    url: '/printawb',
    views: {
        'menuContent': {
          templateUrl: 'templates/printawb.html',
          controller: 'PrintAwbCtrl'
        }
    }
  })

  .state('app.parcelmenu', {
      url: '/parcelmenu',
      views: {
          'menuContent': {
            templateUrl: 'templates/parcelmenu.html',
            controller: 'ParcelMenuCtrl'
          }
      }
  })

  .state('app.listbooked', {
    url: '/listbooked',
    views: {
        'menuContent': {
          templateUrl: 'templates/listbooked.html',
          controller: 'ListBookedCtrl'
        }
    }
  })

  .state('app.listpicked', {
    url: '/listpicked',
    views: {
        'menuContent': {
          templateUrl: 'templates/listpicked.html',
          controller: 'ListPickedCtrl'
        }
    }
  })

  .state('app.confirmpick', {
    url: '/confirmpick',
    views: {
        'menuContent': {
          templateUrl: 'templates/confirmpick.html',
          controller: 'ConfirmPickCtrl'
        }
    }
  })

  .state('app.confirmreceipt', {
    url: '/confirmreceipt',
    views: {
        'menuContent': {
          templateUrl: 'templates/confirmreceipt.html',
          controller: 'ConfirmReceiptCtrl'
        }
    }
  })

  .state('app.listreceived', {
      url: '/listreceived',
      views: {
          'menuContent': {
            templateUrl: 'templates/listreceived.html',
            controller: 'ListReceivedCtrl'
          }
      }
  })

  .state('app.detailtxn', {
    url: '/detailtxn',
    views: {
        'menuContent': {
          templateUrl: 'templates/detailtxn.html',
          controller: 'DetailTxnCtrl'
        }
    }
  })

  .state('app.summary', {
    url: '/summary',
    views: {
        'menuContent': {
            templateUrl: 'templates/summary.html',
            controller: 'SummaryCtrl'
        }
    }
  })

.state('app.changepass', {
    url: '/changepass',
    views: {
        'menuContent': {
            templateUrl: 'templates/changepass.html',
            controller: 'ChangepassCtrl'
        }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});
