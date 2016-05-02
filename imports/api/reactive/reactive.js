import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function responseCount(elicitor) {
  Meteor.subscribe('posts');  
  return Posts.find({elicitor: elicitor}).count();
}