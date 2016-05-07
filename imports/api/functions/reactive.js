import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';
import { PostOb } from './obj-post.js';
import { drawTextBox } from './drawing.js';
import { Coord } from './obj-coord.js';

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  try {

    let center = new Coord((canvas.width+1) / 2, (canvas.height+1) / 2)

    let motion = new PostOb(
      Posts.findOne({"_id": motionId}).author, 
      Posts.findOne({"_id": motionId}).content,
      Posts.find({"elicitor": motionId}).count()
    );

    // console.log(canvas.width/2, ' ', canvas.height/2);

    drawTextBox(motion, bucket, center);

    // for (let i = 0; i < motion.responseNo; i++) {

    // }

    // motion.testMethod();

  } catch(e) {
    /*
    this try catch put in place because of exception thrown by "Posts.findOne({"_id": motion}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
    */
  }
}