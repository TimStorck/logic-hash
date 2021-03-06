import { Template } from 'meteor/templating';
import { Posts } from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';

import './home.html';

Template.home.onCreated(function() {
  Meteor.subscribe('posts');
});

Template.home.helpers({
  recentlyAdded() {
    return Posts.find({$or: [ {elicitor: {$exists: false} }, {elicitor: ""} ] }, {sort: {dateMade: -1}, skip: 0, limit: 10 });
  },
  recentlyActive() {
    return Posts.find({$or: [ {elicitor: {$exists: false} }, {elicitor: ""} ] }, {sort: {dateDiscussed: -1}, skip: 0, limit: 10 });
  }
});

Template.home.events({
  "click #signUp": function() {
    FlowRouter.go("sign_up");
  },
  "click #logout": function() {
    Meteor.logout(function(err) {
      console.log(err);
    });
  },
  'submit #login' : function(event, template) {

    event.preventDefault();

    const username = template.find('#username').value;
    const password = template.find('#password').value;

    Meteor.loginWithPassword(username, password, function() {
      document.getElementById("msg").innerHTML = "Invalid Login Info";
    });
  },
  "click #newMotion": function() {
    FlowRouter.go("/new");
  },
  'click .item' : function() {
    FlowRouter.go("/debate/" + this._id);
  }
});