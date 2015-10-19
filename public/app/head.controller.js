app.controller('AppCtrl', function($scope, MetaSettings, Auth, $rootScope, md5, $state, $mdSidenav, $mdDialog, LocalStore){
  $scope.page = MetaSettings;

  $scope.logout = Auth;
  $scope.isLogged = LocalStore;

  $scope.loginFb = function(){
    window.location.href = '/api/auth/facebook';
  };

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
  };

  $scope.navItems = [
    {
      title:'Admin',
      permission: 'admin',
      items:[
        {icon:'ion-ios-home', linksTo: 'main', text: 'Start'},
        {icon:'ion-ios-world-outline', linksTo: 'admin', text: 'Admin panel'},
        {icon:'ion-flame', linksTo: 'profile', text: 'My profile'},

      ]
    },
    {
      title:'Profile',
      permission: 'user',
      items:[
        {icon:'ion-flame', linksTo: 'profile', text: 'My profile'},
        {icon:'ion-ios-bolt', linksTo: 'settings', text: 'Settings'}
      ]
    },
  ];


      $rootScope.$on('user', function (event, data) {

        if(!data) {
          $scope.user = '';
          return;
        }

        $scope.user = data;

        if ($scope.user.facebook) {
          $scope.user.facebook.displayName = $scope.user.facebook.displayName.split(' ');
          $scope.user.facebook.displayName = $scope.user.facebook.displayName[0];
        }

        if (!data || !$scope.user.email){
          $scope.gravatar = md5.createHash('noemail');
          return;
        }

        $scope.gravatar = md5.createHash(data.email);
      });

      if (!$scope.user || !$scope.user.email ) $scope.gravatar = md5.createHash('noemail');
      else $scope.gravatar = md5.createHash($scope.user.email);




});
