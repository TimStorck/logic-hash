import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function debateTreeChanged(motion, bucket, canCtx) {
  Meteor.subscribe('posts');  
  // console.log(Posts.find({elicitor: motion}).count());
  try {
      return Posts.findOne({"_id": motion}).content;
  } catch(e) {

  }
      console.log(motion + bucket + canCtx);

}