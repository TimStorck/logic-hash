import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../../../api/collections/posts.js';

import './dev-add.html';

Template.devAddTen.onRendered(function (){
  Meteor.subscribe('posts');
});

Template.devAddTen.events({
  'submit #add-form' : function(event, template) {

    event.preventDefault();

    const content = "add-ten content";
    const author = "add-ten author";
    const elicitor = template.find('#elicitor').value;
    
    let elicitorMotion = Posts.findOne({_id: elicitor}).motion;
    let motion;
    if (elicitorMotion != null && elicitorMotion != "") {
      motion = elicitorMotion
    } else {
      motion = elicitor;
    }

    const newPost = {
      content: content,
      author: author,
      elicitor: elicitor,
      motion: motion
    }
    
    for (var i = 0; i < 10; i++) {
      Meteor.call('posts.insert', newPost);
    }
    FlowRouter.go("dev");
  }
});

Template.devRem.events({
  'submit #rem-form' : function(event, template) {

    event.preventDefault();

    const postId = template.find('#_id').value;
    
    Meteor.call('posts.remove', postId);
    
    FlowRouter.go("dev");
  }
});