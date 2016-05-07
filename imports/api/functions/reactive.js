import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';
import { PostOb } from './post-object.js';
import { drawTextBox } from './drawing.js';

export function debateTreeChanged(motionId, bucket, canCtx) {
  Meteor.subscribe('posts');  

  try {
    let motion = new PostOb(Posts.findOne({"_id": motionId}).author, Posts.findOne({"_id": motionId}).content);

    drawTextBox(motion);
  } catch(e) {
    /*
    this try catch put in place because of exception thrown by "Posts.findOne({"_id": motion}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
    */
  }
}