import { Mongo } from 'meteor/mongo';
export const Settings = new Mongo.Collection('settings');

if (Meteor.isServer) {
  Meteor.publish('settings', function() {
    return Settings.find();
  });
}