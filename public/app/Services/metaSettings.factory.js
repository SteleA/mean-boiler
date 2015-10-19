app.factory('MetaSettings', function(){
  var appName = 'Mean app';
  var title = 'default';
  var desc = 'default';

  return {
    appName: function () {return appName;},
    title: function () {return title;},
    setTitle: function (newTitle) {title = newTitle;},
    desc: function (text) {return desc;},
    setDesc: function (newDesc) {desc = newDesc;}
  };

});
