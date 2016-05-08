import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';
import { PostOb } from './objects.js';
import { Coord } from './objects.js';
import { drawTextBox } from './drawing.js';
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
    console.log("Exception thrown loading motion data");
  }

  if (typeof motion != "undefined") {
    drawTextBox(motion, bucket, center);

    let fetchArray = Posts.find({"elicitor": motionId}).fetch();
    // let responseArray = [];

    // for (let i = 0; i < responseArray.length; i++) {
    //   responseArray.push(new PostOb(
    //     fetchArray[i].author,
    //     fetchArray[i].content,
    //     fetchArray[i]._id
    //   ));
    // }
  }
}