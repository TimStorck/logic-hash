import { Template } from 'meteor/templating';
import {Posts} from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';
import {responseCount} from '../../api/reactive/reactive.js';

import './debate.html';

Template.debate.onCreated(function() {
  Meteor.subscribe('posts');

  const handle = this.autorun(function () {
    console.log(responseCount(FlowRouter.getParam("mId")) + " hi"); 
  });
});
