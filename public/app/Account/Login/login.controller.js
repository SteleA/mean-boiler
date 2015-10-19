app.controller('LoginCtrl', function($scope, MetaSettings, Auth, LocalStore){
  MetaSettings.setTitle('Login');



  $scope.submitForm = function(){
    $scope.error = '';

    if($scope.form.username) $scope.form.username = $scope.form.username.toLowerCase();

    Auth.login($scope.form)
      .catch(function(err){
        $scope.error = err.data.message;
      });
  };
});
