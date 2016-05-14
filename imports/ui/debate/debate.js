import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';
import {debateTreeChanged} from '../../functions/reactive.js';

import './debate.html';

Template.debate.onCreated(function() {
  this.elicitor = new ReactiveVar( false );
  this.responseResponse = new ReactiveVar( false );
});

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
  'click .post': function(event) {
    console.log("click post " + event.target.id);
  },
  'click .flagBox': function(event) {
    event.stopPropagation();
    console.log("click flagbox" + event.currentTarget.parentNode.id);
  },
  'click .respondBtn': function(event, template) {
    event.stopPropagation();
    if (event.currentTarget.parentNode.id === FlowRouter.getParam("mId")) {
      template.responseResponse.set( false );
    } else {
      template.responseResponse.set( true );
    }
    console.log("click respondBtn" + event.currentTarget.parentNode.id);
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
  },
  'click .logoDiv': function(event) {
    FlowRouter.go("home");
  },
});

Template.debate.helpers({
  responseResponse() {
    return Template.instance().responseResponse.get();
  }
});