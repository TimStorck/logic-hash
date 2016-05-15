import { Template } from 'meteor/templating';
import { Posts } from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';
import { debateTreeChanged } from '../../functions/reactive.js';
import { Flags } from '../../api/collections/flags.js';

import './debate.html';

Template.debate.onCreated(function() {
  this.elicitor = new ReactiveVar( "initialized, unassigned elicitor reactive var" );
  this.responseResponse = new ReactiveVar( false );
});

Template.debate.onRendered(function() {
  Meteor.subscribe('posts');
  Meteor.subscribe('flags');

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
    console.log("click flagbox " + event.currentTarget.parentNode.id);
  },
  'click .respondBtn': function(event, template) {
    // event.stopPropagation();
    if (event.currentTarget.parentNode.id === FlowRouter.getParam("mId")) {
      template.responseResponse.set( false );
    } else {
      template.responseResponse.set( true );
      template.elicitor.set(event.currentTarget.parentNode.id);
    }
  },
  'mouseover .flagBox': function(event, template) {
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.display = "block";
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.left = event.pageX + 'px';
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.top = event.pageY + 'px';
  },
  'mouseout .flagBox': function(event, template) {
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.display = "none";
  },
  'submit #newResponse' : function(event, template) {
    event.preventDefault();

    const author = Meteor.user().username;
    const content = template.find('#responseText').value;
    let newPost;
    if (Template.instance().responseResponse.get()) {
      newPost = {
        content: content,
        author: author,
        elicitor: Template.instance().elicitor.get()
      }
    } else {
      newPost = {
        content: content,
        author: author,
        elicitor: FlowRouter.getParam("mId")
      }
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
  },
  getElicitor() {
    return truncate(Posts.findOne({"_id": Template.instance().elicitor.get()}).content);
  },
  getFlags() {
    return Flags.find({});
  }
});

function truncate(string) {
  if (string.length > 40) {
    //truncates to last space character before 40th character
    return string.substring(0,string.lastIndexOf(" ", 40)) + " ...";
  } else {
    return string;
  }
}
