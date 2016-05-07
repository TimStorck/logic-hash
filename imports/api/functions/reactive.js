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
    /*
    this try catch put in place because of exception thrown by "Posts.findOne({"_id": motion}).content" when page loading at meteor app startup. if debate page navigated to from landing page it would load fine, and if returned to by the url it would load fine
    */
  }
}