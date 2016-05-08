import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { drawTextBox } from './drawing.js';
import { centerOf } from './measurements.js';

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  try {
    let center = centerOf(new Coord(canvas.width, canvas.height));

    let motion = new PostOb(
      Posts.findOne({"_id": motionId}).author, 
      Posts.findOne({"_id": motionId}).content,
      Posts.find({"elicitor": motionId}).count()
    );

    drawTextBox(motion, bucket, center);

    let responseArray = Posts.find({"elicitor": motionId}).fetch();

    for (let i = 0; i < responseArray.length; i++) {
      console.log(responseArray[i].content);
    }

  } catch(e) {
    /*
    this try catch put in place because of exception thrown by "Posts.findOne({"_id": motion}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
    */
  }
}