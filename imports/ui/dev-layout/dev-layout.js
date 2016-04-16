import { Template } from 'meteor/templating';

import './dev-layout.html';

Template.devLayout.events ({
  "click #btn-tbl": function() {
    FlowRouter.go("dev");
  },
  "click #btn-add": function() {
    FlowRouter.go("dev_add");
  },
  "click #btn-add-doc": function() {
    console.log("btn-add-doc clicked");
    Meteor.call('posts.insert', {content: "test content", author: "test author"});
  },
  "click #btn-add-100": function() {
    console.log("btn-add-100 clicked");
    for (var i = 0; i < 100; i++) {
      Meteor.call('posts.insert', {content: "test content", author: "test author"});
    }
  },
  "click #btn-rem-all": function() {
    console.log("btn-rem-all clicked");
    Meteor.call('posts.removeAll');
  },
  "click #btn-tst": function() {
    console.log("btn-tst clicked");
    FlowRouter.go("dev_test");
  }

});
