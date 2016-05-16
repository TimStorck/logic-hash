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
    // reset bucktet contents
    while (bucket.firstChild) {
      bucket.removeChild(bucket.firstChild);
    }

    //clear canvas
    canCtx.fillStyle = "white";
    canCtx.fillRect(0,0,canvas.width,canvas.height);

    const fSModel = new filledSpaceModel();

    drawMotionTextBox(motion, bucket, motionCenter, fSModel);

    drawResponses(motionId, motionCenter, null, fSModel, true, canCtx);

    /*
      uncomment below line to view Filled Space Model boundaries
    */
    // drawFSModel(fSModel, canvas);
  }
}

function drawResponses(elicitorId, elicitorCenter, sideOscillator,  fSModel, elicitorIsMotion, canCtx) {
  let fetchArray = Posts.find({"elicitor": elicitorId}).fetch();
  if (fetchArray.length > 0) {
    let responseArray = [];
    for(let i = 0; i < fetchArray.length; i++) {
        responseArray.push(new PostOb(
        fetchArray[i]._id,
        fetchArray[i].author,
        fetchArray[i].content,
        Posts.find({"elicitor": fetchArray[i]._id}).count(),
        fetchArray[i].flag,
      ));
    }
    let responseCenter;
    // if elicitor is motion
    if (sideOscillator == null) {
      sideOscillator = 0;
    }
    for (let i = 0; i < responseArray.length; i++) {
      responseCenter = drawResponseTextBox(responseArray[i], bucket, fSModel, sideOscillator);
      drawRadial(elicitorCenter, responseCenter, canCtx);

      if (responseArray[i].responseNo > 0) {
        drawResponses(responseArray[i]._id, responseCenter, sideOscillator, fSModel, false, canCtx);
      }

      if (elicitorIsMotion) {
        sideOscillator === 3 ? sideOscillator = 0 : sideOscillator++;
      }
    }
  }
}

