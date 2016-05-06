import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';

import './debate.html';

Template.debate.onCreated(function() {
  Meteor.subscribe('posts');
  const motionId = FlowRouter.getParam("mId");
});

