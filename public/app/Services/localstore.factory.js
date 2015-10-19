app.factory('LocalStore', function ($window) {

  var store = $window.localStorage;

  return {
    setItem: setItem,
    getItem: getItem
  };


  function getItem(name) {
    return JSON.parse(store.getItem(name));
  }

  function setItem(name, data) {
    if (name, data) {
      store.setItem(name, JSON.stringify(data));
    } else if(name) {
      store.removeItem(name);
    }
  }

});
