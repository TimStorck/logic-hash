import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import { Posts } from '../../../lib/collections.js';

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

Template.layoutDev.helpers({
  posts() {
    return Posts.find({});
  },
});

Template.layoutDev.onCreated(function (){
  Meteor.subscribe('hackers');
});