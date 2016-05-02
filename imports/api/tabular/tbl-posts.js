import { Meteor } from 'meteor/meteor';

import {Posts} from '../collections/posts.js';

if (Meteor.isClient) {
  if (FlowRouter.subsReady()) {
    Meteor.subscribe('posts');  
  }
}


TabularTables = {};

TabularTables.PostsTbl = new Tabular.Table({
  bFilter: false,
  name: "PostsTbl",
  collection: Posts,
  columns: [
    {width: "190px", data: "_id", title: "_id"},
    {width: "190px", data: "elicitor", title: "Response To"},
    {width: "100px", data: "author", title: "Author"},
    {width: "450px", data: "content", title: "Content"}
  ]
});