

Posts = new Mongo.Collection('posts');

if(Meteor.isServer) {
  Meteor.publish('posts', function hackersPublication(){
    return Hackers.find();
  });
}