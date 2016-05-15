import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

import '../imports/api/collections/posts.js';

import '../imports/api/tabular/tbl-posts.js';

import '../imports/api/collections/methods.js';