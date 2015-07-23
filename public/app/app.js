'use strict';

var app = angular.module('MeanApp', [
  'ui.router'
]);

app.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
      setTimeout(function () {
        componentHandler.upgradeAllRegistered();
      }, 100);

    })
});

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
})

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/state1");
  //
  // Now set up the states
  $stateProvider

    .state('state1', {
      url: "/state1",
      templateUrl: "app/Main/main.html",
      controller: 'MainCtrl',
    })

    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })

});


app.controller('MainCtrl', ['$scope', function($scope){
  $scope.loginSubmit = function(){
    alert(JSON.stringify($scope.login));
    $scope.login.username = '';
    $scope.login.password = '';
  }
}]);
