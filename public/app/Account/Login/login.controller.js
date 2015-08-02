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
