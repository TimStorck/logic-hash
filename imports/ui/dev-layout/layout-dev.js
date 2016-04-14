import { Template } from 'meteor/templating';

import './layout-dev.html';

Template.layoutDev.events ({
  "click #btn-test-temp": function() {
    
    console.log("btn-test-flow clicked");
    
    console.log(Template);
  },
  "click #btn-add-doc": function() {
    console.log("btn-add-doc clicked");
    Meteor.call('posts.insert', {content: "test content", author: "test author"});
  }

});
