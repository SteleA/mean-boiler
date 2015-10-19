app.factory('Auth', function($http, LocalStore, $rootScope, $state, $q){

  return {
    login: login,
    signup: signup,
    logout: logout,
    userIs: userIs,
    userSettings: userSettings,
    loginWithToken: loginWithToken,
    refresh: getUserInfo,
    forgot: forgot,
    resetPassword: resetPassword,
    getUsers: getUsers,
    deleteUser: deleteUser,
  };

  function login(user) {
    LocalStore.setItem('user');
    LocalStore.setItem('auth-token');
    return $http.post('/api/auth/local', user)
      .then(
        function success(response) {
          LocalStore.setItem('auth-token',response.data.token);
        }
      )
      .then(getUserInfo);
  }

  function signup(user){
    LocalStore.setItem('user');
    LocalStore.setItem('auth-token');
    return $http.post('/api/user', user)
      .then(
        function success(response) {
          LocalStore.setItem('auth-token', response.data.token);
        }
      )
      .then(getUserInfo);
  }

  function getUserInfo(user){
    return $http.get('/api/user/profile/me')
      .then(
        function success(response) {
          $rootScope.$emit('user', response.data);
          LocalStore.setItem('user',response.data);
          $state.go('profile');
        }
      );
  }

  function loginWithToken(token){
    LocalStore.setItem('auth-token',token);
    return getUserInfo();
  }

  function userIs(){
    return $http.get('/api/user/profile/me');
  }

  function userSettings(user){
    return $http.put('/api/user', user)
      .then(getUserInfo);
  }

  function logout(){

    LocalStore.setItem('user');
    LocalStore.setItem('auth-token');
    $rootScope.$emit('user', LocalStore.getItem('user'));
    $state.go('main');

  }

  function forgot(usernameOrEmail){
    return $http.get('/api/user/forgotpassword/' + usernameOrEmail);
  }

  function resetPassword(resetTokenAndPassword){
    return $http.post('/api/user/resetPassword', resetTokenAndPassword);
  }

  function getUsers(){
    return $http.get('/api/user');
  }

  function deleteUser(user){
    return $http.delete('/api/user/' + user._id);
  }


});
