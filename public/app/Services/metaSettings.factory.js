app.factory('MetaSettings', function(){
  var title = 'default';
  var desc = 'default';

  return {
    title: function () {return title;},
    setTitle: function (newTitle) {title = newTitle;},
    desc: function (text) {return desc;},
    setDesc: function (newDesc) {desc = newDesc;}
  }

});
