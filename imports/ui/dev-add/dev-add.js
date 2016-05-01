import { Template } from 'meteor/templating';

import './dev-add.html';

Template.devAdd.events({
  'submit #add-form' : function(event, template) {

    console.log("submit pressed");
    event.preventDefault();
    console.log("submit pressed");

    const content = template.find('#content').value;
    const author = template.find('#author').value;
    const responseTo = template.find('#responseTo').value;

    const newPost = {
      content: content,
      author: author,
      responseTo: responseTo,
    }

    Meteor.call('posts.insert', newPost);
    FlowRouter.go("dev");
  }
});

Template.devAddTen.events({
  'submit #add-form' : function(event, template) {

    console.log("submit pressed");
    event.preventDefault();
    console.log("submit pressed");

    const content = "Add Ten Content";
    const author = "Add Ten Author";
    const responseTo = template.find('#responseTo').value;

    const newPost = {
      content: content,
      author: author,
      responseTo: responseTo,
    }
    
    for (var i = 0; i < 10; i++) {
      Meteor.call('posts.insert', newPost);
    }
    FlowRouter.go("dev");
  }
});