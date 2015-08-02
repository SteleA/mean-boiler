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

app.controller('AppCtrl', function($scope, MetaSettings, LocalStore, $rootScope, md5, $state){
  $scope.page = MetaSettings;

  $scope.logout = function(){
    LocalStore.logout()
      .then(function(){$state.go('main');})
  };





      $rootScope.$on('user', function (event, data) {
        $scope.user = data;

        if (!data || !$scope.user.email) return $scope.gravatar = md5.createHash('noemail');

        $scope.gravatar = md5.createHash(data.email);
      });

      if (!$scope.user || !$scope.user.email ) $scope.gravatar = md5.createHash('noemail');
      else $scope.gravatar = md5.createHash($scope.user.email);

});

app.controller('MainCtrl', function($scope, MetaSettings, LocalStore, $rootScope, md5, $state){
  MetaSettings.setTitle('Main');


});

app.factory('Auth', function($http, LocalStore, $rootScope, $state, $q){
  var LOGIN_URL = '/api/auth/local';


  return {
    login: login,
    signup: signup,
    logout: logout,
    userIs: userIs,
  }

  function login(user) {
    LocalStore.clear();
    return $http.post(LOGIN_URL, user)
      .then(
        function success(response) {
          LocalStore.setToken(response.data.token);
        }
      )
      .then(getUserInfo)
  };

  function signup(user){
    LocalStore.clear();
    return $http.post('/api/user', user)
      .then(
        function success(response) {
          LocalStore.setToken(response.data.token);
        }
      )
      .then(getUserInfo);
  };

  function getUserInfo(user){
    return $http.get('/api/user/profile/me')
      .then(
        function success(response) {
          $rootScope.$emit('user', response.data);
          LocalStore.setUser(JSON.stringify(response.data));
          $state.go('profile')
        }
      )
  }

  function userIs(role){
    return $http.get('/api/user/profile/me')
      
  }

  function logout(){
    LocalStore.logout();
  };

});

app.factory('AuthInterceptor', function AuthInterceptor(LocalStore) {
  'use strict';
  return {
    request: addToken
  };

  function addToken(config) {
    var token = LocalStore.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
});

app.factory('LocalStore', function ($window, $rootScope, $q) {

  var store = $window.localStorage;


  return {
    getToken: getToken,
    setToken: setToken,
    getUser: getUser,
    setUser: setUser,
    clear: clear,
    logout: logout
  };

  function getToken() {
    return store.getItem('auth-token');
  }

  function setToken(token) {
    if (token) {
      store.setItem('auth-token', token);
    } else {
      store.removeItem('auth-token');
    }
  }

  function getUser() {
    return JSON.parse(store.getItem('user'));
  }

  function setUser(user) {
    if (user) {
      store.setItem('user', user);
    } else {
      store.removeItem('user');
    }
  }

  function clear(){
    store.removeItem('auth-token');
    store.removeItem('user');
  }

  function logout() {

    var deferred = $q.defer();

     clear();
     $rootScope.$emit('user', '');

     deferred.resolve();
     
     return deferred.promise;
  }

});

app.factory('MetaSettings', function(){
  var title = 'default';
  var desc = 'default';

  return {
    title: function () {return title;},
    setTitle: function (newTitle) {title = newTitle;},
    desc: function (text) {return desc;},
    setDesc: function (newDesc) {desc = newDesc;}
  }

});

app.controller('AdminCtrl', function($http, $scope, MetaSettings, Auth){
  MetaSettings.setTitle('Admin');

  $http.get('/api/user')
    .then(function success(res){
      $scope.users = res.data;
    })

  $scope.delete = function(user){
    //alert(JSON.stringify(user._id))

    $http.delete('/api/user/' + user._id)
      .then(function success(res){
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i]._id === user._id) {
            $scope.users.splice(i,1);
          }
        }
      })


  }

});

app.controller('LoginCtrl', function($scope, MetaSettings, Auth, LocalStore){
  MetaSettings.setTitle('Login');

  $scope.submitForm = function(){
    $scope.error = '';


    Auth.login($scope.login)
      .then(function(res){
        
      })
      .catch(function(err){
        $scope.error = err.data.message

      })

  }
});

app.controller('ProfileCtrl', function($scope, MetaSettings, LocalStore){
  MetaSettings.setTitle('Profile');


  

});

app.controller('SettingsCtrl', function($scope, MetaSettings, Auth, LocalStore){
  MetaSettings.setTitle('Settings');

  $scope.settings = {
    username: $scope.user.username,
    email: $scope.user.email,
  }



  $scope.submitForm = function(user){
    $scope.error = '';

    return alert(JSON.stringify(user) )


    Auth.login($scope.login)
      .then(function(res){

      })
      .catch(function(err){
        $scope.error = err.data.message

      })

  }
});

app.controller('SignupCtrl', function($scope, MetaSettings, Auth){
  MetaSettings.setTitle('Signup');

  var SignupCtrl = this;

  $scope.submitForm = function(user){
    Auth.signup(user)
      .then(function(res){})
      .catch(function(err){
        $scope.error = '';

        if (err.data.errors.username) {
          $scope.error = err.data.errors.username.message;
        }

        if (err.data.errors.username && err.data.errors.email) {
          $scope.error = $scope.error + ' & ';
        }

        if (err.data.errors.email) {
          $scope.error = $scope.error + err.data.errors.email.message;
        }

      })

  }

});
