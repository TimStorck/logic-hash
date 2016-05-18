import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/collections/posts.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { filledSpaceModel } from './fsm.js';
import { drawMotionTextBox } from './drawing.js';
import { drawResponseTextBox } from './drawing.js';
import { drawRadial } from './drawing.js';
import { drawFSModel } from './drawing.js';
import { centerOf } from './measurements.js';

export const fSModel = new filledSpaceModel();

export function debateTreeChanged(motionId, bucket, canvas) {
  Meteor.subscribe('posts');  

  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth - 50;

  let motionCenter = centerOf(new Coord(canvas.width, canvas.height));
  let canCtx = canvas.getContext("2d");

  let motion;
  
  try {
    let motionQueryResult = Posts.findOne({"_id": motionId});

    motion = new PostOb(
      motionQueryResult._id, 
      motionQueryResult.author, 
      motionQueryResult.content,
      Posts.find({"elicitor": motionId}).count(),
      null,
      motionQueryResult.elicitor
    );
  } catch(e) {
    // this try catch put in place because of exception thrown by "Posts.findOne({"_id": motionId}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
  }

  if (typeof motion != "undefined") {
    // reset bucktet contents
    while (bucket.firstChild) {
      bucket.removeChild(bucket.firstChild);
    }
    fSModel.reset();

    //clear canvas
    canCtx.fillStyle = "white";
    canCtx.fillRect(0,0,canvas.width,canvas.height);

    drawMotionTextBox(motion, bucket, motionCenter, canvas);

    drawResponses(motionId, motionCenter, true, canCtx);

    /*
      uncomment below line to view Filled Space Model boundaries
    */
    drawFSModel(canvas);
  }
}

function drawResponses(elicitorId, elicitorCenter, elicitorIsMotion, canCtx) {
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
        fetchArray[i].elicitor
      ));
    }
    let responseCenter;
    for (let i = 0; i < responseArray.length; i++) {
      responseCenter = drawResponseTextBox(responseArray[i], bucket, elicitorCenter);
      // drawRadial(elicitorCenter, responseCenter, canCtx);

      // if (responseArray[i].responseNo > 0) {
      //   drawResponses(responseArray[i]._id, responseCenter, false, canCtx);
      // }
    }
  }
}

