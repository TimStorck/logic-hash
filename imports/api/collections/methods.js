import { Posts } from './posts.js';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'posts.insert': function(postParam) {
    if (postParam.elicitor == null || postParam.elicitor == "") {
      postParam.dateDiscussed = Date();
      postParam.dateMade = Date();
    } else {
      //TODO make below coniditonal update recursive
      Posts.update({_id: postParam.elicitor}, {$set: {dateDiscussed: Date()} } );
    }
    Posts.insert(postParam);
  },
  'posts.removeAll': function() {
    Posts.remove({});
  }
})
