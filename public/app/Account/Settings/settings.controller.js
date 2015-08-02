app.controller('SettingsCtrl', function($scope, MetaSettings, Auth, LocalStore){
  MetaSettings.setTitle('Settings');

  $scope.settings = {
    username: $scope.user.username,
    email: $scope.user.email,
  }



  $scope.submitForm = function(user){
    $scope.error = '';

    //return alert(JSON.stringify(user) )


    Auth.userSettings(user)
      .then(function(res){
        alert(JSON.stringify(res.data))
      })
      .catch(function(err){

        alert(JSON.stringify(err))
        $scope.error = err.data.message

      })

  }
});
