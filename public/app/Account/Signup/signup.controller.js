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
