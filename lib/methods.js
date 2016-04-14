Meteor.methods({
  'posts.insert': function(postParam) {
    Posts.insert(postParam);
  }
})