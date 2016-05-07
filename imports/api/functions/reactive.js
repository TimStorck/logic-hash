import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';
import { PostOb } from './obj-post.js';
import { drawTextBox } from './drawing.js';

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  try {

    let motion = new PostOb(
      Posts.findOne({"_id": motionId}).author, 
      Posts.findOne({"_id": motionId}).content,
      Posts.find({"elicitor": motionId}).count()
    );

    drawTextBox(motion);

    // for (let i = 0; i < motion.responseNo; i++) {

    // }

    // motion.testMethod();

  } catch(e) {
    /*
    this try catch put in place because of exception thrown by "Posts.findOne({"_id": motion}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
    */
  }
}