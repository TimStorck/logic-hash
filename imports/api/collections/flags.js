import { Mongo } from 'meteor/mongo';
export const Flags = new Mongo.Collection('flags');

if (Meteor.isServer) {
  Meteor.publish('flags', function() {
    return Flags.find();
  });
}