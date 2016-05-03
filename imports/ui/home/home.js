import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';

import './home.html';

Template.home.onCreated(function() {
  Meteor.subscribe('posts');
});

Template.home.helpers({
  recentlyAdded() {
    return Posts.find();
  },
  recentlyActive() {
    return Posts.find();
  }
});