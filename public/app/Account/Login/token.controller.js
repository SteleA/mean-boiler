app.controller('TokenCtrl', function($scope, MetaSettings, Auth, $stateParams){
  MetaSettings.setTitle('Main');
  Auth.loginWithToken($stateParams.token);
});
