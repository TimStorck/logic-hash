import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function debateTreeChanged(motion, bucket, canCtx) {
  Meteor.subscribe('posts');  

  try {
      let content = Posts.findOne({"_id": motion}).content;
      bucket.innerHTML = content;
  } catch(e) {

  }
      // console.log(motion + bucket + canCtx);

}