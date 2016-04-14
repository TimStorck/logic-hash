import { Template } from 'meteor/templating';

import './layout-dev.html';

Template.layoutDev.events ({
  "click #btn-tbl": function() {
    FlowRouter.go("dev");
  },
  "click #btn-add": function() {
    FlowRouter.go("dev_add");
  },
  "click #btn-add-doc": function() {
    console.log("btn-add-doc clicked");
    Meteor.call('posts.insert', {content: "test content", author: "test author"});
  }

});
