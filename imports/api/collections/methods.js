import { Posts } from './posts.js';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'posts.insert': function(postParam) {
    //TODO make below coniditonal update recursive
    if (postParam.elicitor != null) {
      Posts.update({_id: postParam.elicitor}, {date: Date()});
    }
    Posts.insert(postParam);
  },
  'posts.removeAll': function() {
    Posts.remove({});
  }
})
