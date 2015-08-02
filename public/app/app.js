'use strict';

var app = angular.module('MeanApp', [
  'ui.router',
  'angular-md5'
]);

app.run(function($rootScope, $state, LocalStore, Auth) {
    $rootScope.user = LocalStore.getUser();

    $rootScope.$on('$viewContentLoaded', function () {
      setTimeout(function () {
        componentHandler.upgradeAllRegistered();
      }, 100);
    });

    $rootScope.$on('$stateChangeStart', function (event, next) {

    if (next.authenticate) {
      if (LocalStore.getUser()) return
      event.preventDefault();
      $state.go('login');
    }

    if (next.hasRole === 'admin') {
      var userRole = next.hasRole;

      Auth.userIs(userRole)
        .then(
          function success(response) {
            if (userRole === response.data.role){
              return
            }else {
              event.preventDefault();
              $state.go('main');
            }
          }
        )
    }

    });
});

app.config(function ($locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('AuthInterceptor');
})



app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider

    .state('main', {
      url: "/",
      templateUrl: "app/Main/main.html",
      controller: 'MainCtrl',
    })

    .state('login', {
      url: "/login",
      templateUrl: "app/Account/Login/login.html",
      controller: 'LoginCtrl'
    })

    .state('signup', {
      url: "/signup",
      templateUrl: "app/Account/Signup/signup.html",
      controller: 'SignupCtrl as signupCtrl'
    })

    .state('profile', {
      url: "/profile",
      templateUrl: "app/Account/Profile/profile.html",
      controller: 'ProfileCtrl',
      authenticate: true,
    })

    .state('settings', {
      url: "/settings",
      templateUrl: "app/Account/Settings/settings.html",
      controller: 'SettingsCtrl',
      authenticate: true,
    })

    .state('admin', {
      url: "/admin",
      templateUrl: "app/Account/Admin/admin.html",
      controller: 'AdminCtrl',
      hasRole: 'admin',
    })

});
