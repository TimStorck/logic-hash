import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';
import {debateTreeChanged} from '../../api/functions/reactive.js';

import './debate.html';

Template.debate.onRendered(function() {
  Meteor.subscribe('posts');

  const handle = this.autorun(function () {
    debateTreeChanged(
      FlowRouter.getParam("mId"), 
      document.getElementById("bucket"), 
      document.getElementById("debateCanvas")
    ); 
  });
});

Template.debate.events({
  // 'click .post': function(event) {
  //   console.log("click post " + event.target.id);
  // },
  'click .flagBox': function(event) {
    console.log("click flagbox" + event.currentTarget.parentNode.id);
  },
  'submit #newResponse' : function(event, template) {

    event.preventDefault();

    const author = Meteor.user().username;
    const content = template.find('#responseText').value;

    const newPost = {
      content: content,
      author: author,
      elicitor: FlowRouter.getParam("mId")
    }

    Meteor.call('posts.insert', newPost);
  }
});