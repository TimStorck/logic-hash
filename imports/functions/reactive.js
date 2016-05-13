import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/collections/posts.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { filledSpaceModel } from './objects.js';
import { drawMotionTextBox } from './drawing.js';
import { drawResponseTextBox } from './drawing.js';
import { drawRadial } from './drawing.js';
import { drawFSModel } from './drawing.js';
import { centerOf } from './measurements.js';

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth - 50;

  let motionCenter = centerOf(new Coord(canvas.width, canvas.height));
  let canCtx = canvas.getContext("2d");

  let motion;
  
  try {
    motion = new PostOb(
      Posts.findOne({"_id": motionId})._id, 
      Posts.findOne({"_id": motionId}).author, 
      Posts.findOne({"_id": motionId}).content,
      Posts.find({"elicitor": motionId}).count()
    );
  } catch(e) {
    // this try catch put in place because of exception thrown by "Posts.findOne({"_id": motionId}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
  }

  if (typeof motion != "undefined") {
    while (bucket.firstChild) {
      bucket.removeChild(bucket.firstChild);
    }

    canCtx.fillStyle = "white";
    canCtx.fillRect(0,0,canvas.width,canvas.height);

    const fSModel = new filledSpaceModel();

    drawMotionTextBox(motion, bucket, motionCenter, fSModel);

    let fetchArray = Posts.find({"elicitor": motionId}).fetch();
    let responseArray = [];
    for (let i = 0; i < fetchArray.length; i++) {
      responseArray.push(new PostOb(
        fetchArray[i]._id,
        fetchArray[i].author,
        fetchArray[i].content,
        Posts.find({"elicitor": fetchArray[i]._id}).count()
      ));
    }
    let responseCenter;
    let sideOscillator = 0;
    for (let i = 0; i < responseArray.length; i++) {
      responseCenter = drawResponseTextBox(responseArray[i], bucket, fSModel, sideOscillator);
      drawRadial(motionCenter, responseCenter, canCtx);
      if (sideOscillator === 3) {
        sideOscillator = 0;
      } else {
        sideOscillator++;
      }
    }

    /*
      uncomment below line to view Filled Space Model boundaries
    */
    drawFSModel(fSModel, canvas);
  }
}