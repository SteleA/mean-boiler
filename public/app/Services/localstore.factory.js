app.factory('LocalStore', function ($window, $rootScope, $q) {

  var store = $window.localStorage;


  return {
    getToken: getToken,
    setToken: setToken,
    getUser: getUser,
    setUser: setUser,
    clear: clear,
    logout: logout
  };

  function getToken() {
    return store.getItem('auth-token');
  }

  function setToken(token) {
    if (token) {
      store.setItem('auth-token', token);
    } else {
      store.removeItem('auth-token');
    }
  }

  function getUser() {
    return JSON.parse(store.getItem('user'));
  }

  function setUser(user) {
    if (user) {
      store.setItem('user', user);
    } else {
      store.removeItem('user');
    }
  }

  function clear(){
    store.removeItem('auth-token');
    store.removeItem('user');
  }

  function logout() {

    var deferred = $q.defer();

     clear();
     $rootScope.$emit('user', '');

     deferred.resolve();
     
     return deferred.promise;
  }

});
