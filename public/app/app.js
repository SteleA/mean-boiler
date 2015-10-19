
var app = angular.module('MeanApp', [
  'ui.router',
  'angular-md5',
  'ngMaterial'
]);

app.run(function($rootScope, $state, LocalStore, Auth) {
    $rootScope.user = LocalStore.getItem('user');

    $rootScope.$on('$stateChangeStart', function (event, next) {

    if (next.authenticate) {
      if (LocalStore.getItem('user')) return;
      event.preventDefault();
      $state.go('login');
    }

    if (next.hasRole === 'admin') {
      var userRole = next.hasRole;

      if (!LocalStore.getItem('user')){
        event.preventDefault();
        $state.go('main');
      }

      Auth.userIs()
        .then(
          function success(response) {
            if (userRole === response.data.role){
              return;
            }else {
              event.preventDefault();
              $state.go('main');
            }
          }
        );
    }

    });
});

app.config(function ($locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('AuthInterceptor');
});



app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider

    .state('main', {
      url: "/",
      templateUrl: "app/Main/main.html",
      controller: 'MainCtrl',
    })

    .state('token', {
      url: "/token/:token",
      templateUrl: "app/Main/main.html",
      controller: 'TokenCtrl',
    })

    .state('login', {
      url: "/login",
      templateUrl: "app/Account/Login/login.html",
      controller: 'LoginCtrl'
    })

    .state('forgot', {
      url: "/forgot",
      templateUrl: "app/Account/Forgot/forgot.html",
      controller: 'ForgotCtrl'
    })

    .state('resetPassword', {
      url: "/resetPassword/:forgotPasswordToken",
      templateUrl: "app/Account/Forgot/reset.html",
      controller: 'ResetCtrl'
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
    });

});
