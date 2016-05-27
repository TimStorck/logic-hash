import { Meteor } from 'meteor/meteor';
import { Settings } from '../imports/api/collections/settings.js';

Meteor.startup(() => {
  // code to run on server at startup
});

import '../imports/api/collections/settings.js';

import '../imports/api/collections/posts.js';

import '../imports/api/tabular/tbl-posts.js';

import '../imports/api/collections/methods.js';

if (Settings.find().count() === 0) {
  Meteor.call('settings.loadDefault');
}