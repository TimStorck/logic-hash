import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function debateTreeChanged(motion, bucket, canCtx) {
  Meteor.subscribe('posts');  

  try {
    let content = Posts.findOne({"_id": motion}).content;
    var newElem = document.createElement("div");
    newElem.setAttribute("class", "motion");
    newElem.innerHTML = content;
    newElem.style.top = "250px";
    newElem.style.left = "450px";
    bucket.appendChild(newElem);
  } catch(e) {

  }
      // console.log(motion + bucket + canCtx);

}