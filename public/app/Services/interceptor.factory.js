app.factory('AuthInterceptor', function AuthInterceptor(LocalStore) {
  'use strict';
  return {
    request: addToken
  };

  function addToken(config) {
    var token = LocalStore.getItem('auth-token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
});
