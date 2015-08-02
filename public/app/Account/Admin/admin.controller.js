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
