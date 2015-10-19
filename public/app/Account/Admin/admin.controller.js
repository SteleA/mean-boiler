app.controller('AdminCtrl', function($http, $scope, MetaSettings, Auth){
  MetaSettings.setTitle('Admin');

  Auth.getUsers()
    .then(function success(res){
      $scope.users = res.data;
    });

  $scope.delete = function(user){
    Auth.deleteUser(user)
      .then(function success(res){
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i]._id === user._id) {
            $scope.users.splice(i,1);
          }
        }
      });
  };


});
