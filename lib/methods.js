Meteor.methods({
  'posts.insert': function(postParam) {
    Posts.insert(postParam);
  },
  'posts.removeAll': function() {
    Posts.remove({});
  }
})