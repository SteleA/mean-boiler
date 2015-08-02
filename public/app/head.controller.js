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
