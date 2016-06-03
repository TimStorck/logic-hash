import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/collections/posts.js';
import { Settings } from '../api/collections/settings.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { filledSpaceModel } from './fsm.js';
import { drawMotionTextBox } from './drawing.js';
import { drawResponseTextBox } from './drawing.js';
import { drawRadial } from './drawing.js';
import { drawFSModel } from './drawing.js';
import { clearCanvas } from './drawing.js';
import { centerOf } from './measurements.js';
import { checkIfOverEdge } from './grow.js';

export const fSModel = new filledSpaceModel(null, null);

export function debateTreeChanged(motionId, bucket, canvas, debateWidth, debateHeight, motionCenter) {
  Meteor.subscribe('posts');  
  Meteor.subscribe('settings');  

  canvas.width = debateWidth;
  canvas.height = debateHeight;

  if (motionCenter == null) {
    motionCenter = centerOf(new Coord(canvas.width, canvas.height));
  }

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

    drawMotionTextBox(motion, bucket, motionCenter);

    /*
      for development
    */
    try {
      if (Settings.findOne({name: "drawOutlineEachBox"}).value) {
        drawFSModel(canCtx);
      }
    } catch (e) {
    }

    let canvasExpansion = [0,0,0,0];
    drawResponses(motionId, motionCenter, canCtx, canvas, canvasExpansion);

    if (canvasExpansion[0] > 0 || canvasExpansion[1] > 0 || canvasExpansion[2] > 0 || canvasExpansion[3] > 0) {
      let newWidth = canvas.width + canvasExpansion[1] + canvasExpansion[3];
      let newHeight = canvas.height + canvasExpansion[0] + canvasExpansion[2];
      let newCenter = new Coord(canvas.width / 2, canvas.height / 2);
      newCenter.x = newCenter.x + Math.floor((canvasExpansion[3] - canvasExpansion[1]) / 2);
      newCenter.y = newCenter.y + Math.floor((canvasExpansion[0] - canvasExpansion[2]) / 2);
      debateTreeChanged(motionId, bucket, canvas, newWidth, newHeight, newCenter);

      // console.log("top expansion   " + canvasExpansion[0]);
      // console.log("right expansion   " + canvasExpansion[1]);
      // console.log("bottom expansion   " + canvasExpansion[2]);
      // console.log("left expansion   " + canvasExpansion[3]);
    }

    /*
      for development
    */
    try {
      if (Settings.findOne({name: "drawOutline"}).value) {
        drawFSModel(canCtx);
      }
    } catch (e) {
    }
  }
}

function drawResponses(elicitorId, elicitorCenter, canCtx, canvas, canvasExpansion) {
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
      responseCenter = drawResponseTextBox(responseArray[i], bucket, elicitorCenter, canCtx, canvas);
      checkIfOverEdge(canvas, fSModel.marginBox, canvasExpansion);
      drawRadial(elicitorCenter, responseCenter, canCtx);

      /*
        for development
      */
      try {
        if (Settings.findOne({name: "drawOutlineEachBox"}).value) {
          if (!Settings.findOne({name: "drawAreaToCheck"}).value && !Settings.findOne({name: "drawLineBeingChecked"}).value) {
            clearCanvas(canvas, canCtx);
          }
          drawFSModel(canCtx);
        }
      } catch (e) {
      }

      if (responseArray[i].responseNo > 0) {
        drawResponses(responseArray[i]._id, responseCenter, canCtx, canvas, canvasExpansion);
      }
    }
  }
}

