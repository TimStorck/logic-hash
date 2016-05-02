import { Meteor } from 'meteor/meteor';
import {Posts} from '../collections/posts.js';

export function thing() {
  console.log("thing called");
  Meteor.subscribe('posts');  
  return Posts.find().count();
}