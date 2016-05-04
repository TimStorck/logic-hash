import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';

import './home.html';

Template.home.onCreated(function() {
  Meteor.subscribe('posts');
});

Template.home.helpers({
  recentlyAdded() {
    return Posts.find();
  },
  recentlyActive() {
    return Posts.find();
  }
});

Template.home.events({
  "click #signup-span": function() {
    FlowRouter.go("sign_up");
  },
  'submit #login' : function(event, template) {

    event.preventDefault();

    const username = template.find('#username').value;
    const password = template.find('#password').value;

    Meteor.loginWithPassword(username, password, function() {
      document.getElementById("msg").innerHTML = "Invalid Login Info";
    });
  }
});