import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Posts} from '../collections/posts.js';

if (Meteor.isClient) {
  if (FlowRouter.subsReady()) {
    Meteor.subscribe('posts');  
  }
}

export function thing() {
  console.log("thing called");
    Meteor.subscribe('posts');  
  console.log(Posts.find().count());
}