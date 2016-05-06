import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function debateTreeChanged(motion, wrapper) {
  Meteor.subscribe('posts');  
  // console.log(Posts.find({elicitor: motion}).count());

    return Posts.findOne({"_id": motion}).content;

}