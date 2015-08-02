app.factory('Auth', function($http, LocalStore, $rootScope, $state, $q){
  var LOGIN_URL = '/api/auth/local';


  return {
    login: login,
    signup: signup,
    logout: logout,
    userIs: userIs,
    userSettings: userSettings,
  }

  function login(user) {
    LocalStore.clear();
    return $http.post(LOGIN_URL, user)
      .then(
        function success(response) {
          LocalStore.setToken(response.data.token);
        }
      )
      .then(getUserInfo)
  };

  function signup(user){
    LocalStore.clear();
    return $http.post('/api/user', user)
      .then(
        function success(response) {
          LocalStore.setToken(response.data.token);
        }
      )
      .then(getUserInfo);
  };

  function getUserInfo(user){
    return $http.get('/api/user/profile/me')
      .then(
        function success(response) {
          $rootScope.$emit('user', response.data);
          LocalStore.setUser(JSON.stringify(response.data));
          $state.go('profile')
        }
      )
  }

  function userIs(role){
    return $http.get('/api/user/profile/me')
  }

  function userSettings(user){
    return $http.put('/api/user/', user)
  }

  function logout(){
    LocalStore.logout();
  };

});
