import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function thing(elicitor) {
  console.log("thing called");
  Meteor.subscribe('posts');  
  return Posts.find({elicitor: elicitor}).count();
}