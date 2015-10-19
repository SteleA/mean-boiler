app.controller('ResetCtrl', function($scope, MetaSettings, Auth, $stateParams, $mdDialog, $state){
  MetaSettings.setTitle('Reset password');



  $scope.submitForm = function(){
    $scope.error = '';


    Auth.resetPassword({
      password: $scope.form.password,
      resetToken: $stateParams.forgotPasswordToken
    })
      .then(function success(res){
        var msg;

        if(res.data.message == 'success') {
          msg = 'Success! Your password has been changed.';
          $state.go('login');
        }

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Reset password')
            .content(msg)
            .ariaLabel('Reset passord')
            .ok('Got it!')
            .targetEvent()
        );



      })
      .catch(function(err){
        $scope.error = err.data;
      });
  };
});
