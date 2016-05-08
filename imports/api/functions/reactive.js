import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../collections/posts.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { filledSpaceModel } from './objects.js';
import { drawMotionTextBox } from './drawing.js';
import { drawResponseTextBox } from './drawing.js';
import { centerOf } from './measurements.js';

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  let center = centerOf(new Coord(canvas.width, canvas.height));

  let motion;

  try {
    motion = new PostOb(
      Posts.findOne({"_id": motionId}).author, 
      Posts.findOne({"_id": motionId}).content,
      Posts.find({"elicitor": motionId}).count()
    );
  } catch(e) {
    // this try catch put in place because of exception thrown by "Posts.findOne({"_id": motionId}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
  }

  if (typeof motion != "undefined") {
    const fSModel = new filledSpaceModel();

    drawMotionTextBox(motion, bucket, center, fSModel);

    let fetchArray = Posts.find({"elicitor": motionId}).fetch();
    let responseArray = [];
    for (let i = 0; i < fetchArray.length; i++) {
      responseArray.push(new PostOb(
        fetchArray[i].author,
        fetchArray[i].content,
        fetchArray[i]._id
      ));
    }
    for (let i = 0; i < responseArray.length; i++) {
      drawResponseTextBox(responseArray[i], bucket, fSModel);
    }
  }
}