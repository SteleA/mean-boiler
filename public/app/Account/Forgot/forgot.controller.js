app.controller('ForgotCtrl', function($scope, MetaSettings, Auth, $mdDialog){
  MetaSettings.setTitle('Forgot password');

  $scope.submitForm = function(){
    $scope.error = '';

    Auth.forgot($scope.form.username)
      .then(function success(){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Reset password')
            .content('We have sent you a reset password link to your email. Check your inbox and spam folder.')
            .ariaLabel('Reset passord')
            .ok('Got it!')
            .targetEvent()
        );
      })
      .catch(function error(err){
        $scope.error = err.data;
      });
  };
});
