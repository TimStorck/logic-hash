import { Posts } from './posts.js';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'posts.insert': function(postParam) {
    Posts.insert(postParam);
  },
  'posts.removeAll': function() {
    Posts.remove({});
  }
})
