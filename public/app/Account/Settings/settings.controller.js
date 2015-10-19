app.controller('SettingsCtrl', function($scope, MetaSettings, Auth, LocalStore){
  MetaSettings.setTitle('Settings');

  $scope.form = {
    username: $scope.user.username,
    email: $scope.user.email,
  };



  $scope.submitForm = function(){
    $scope.error = '';

    Auth.userSettings($scope.form)
      .then(function success(){
        
      })
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

      });

  };
});
