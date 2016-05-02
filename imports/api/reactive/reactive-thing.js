import { Meteor } from 'meteor/meteor';

import {Posts} from '../collections/posts.js';

if (Meteor.isClient) {
  if (FlowRouter.subsReady()) {
    Meteor.subscribe('posts');  
  }
}

export function thing() {
  console.log("thing called");
  console.log(Posts.find().count());
}