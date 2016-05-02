import { Template } from 'meteor/templating';

import './dev-add.html';

Template.devAdd.events({
  'submit #add-form' : function(event, template) {

    event.preventDefault();

    const content = template.find('#content').value;
    const author = template.find('#author').value;
    const elicitor = template.find('#elicitor').value;

    const newPost = {
      content: content,
      author: author,
      elicitor: elicitor,
    }

    Meteor.call('posts.insert', newPost);
    FlowRouter.go("dev");
  }
});

Template.devAddTen.events({
  'submit #add-form' : function(event, template) {

    event.preventDefault();

    const content = "add-ten content";
    const author = "add-ten author";
    const elicitor = template.find('#elicitor').value;

    const newPost = {
      content: content,
      author: author,
      elicitor: elicitor,
    }
    
    for (var i = 0; i < 10; i++) {
      Meteor.call('posts.insert', newPost);
    }
    FlowRouter.go("dev");
  }
});