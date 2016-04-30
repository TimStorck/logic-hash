import { Meteor } from 'meteor/meteor';

import {Posts} from '../collections/posts.js';

if (Meteor.isClient) {
  if (FlowRouter.subsReady()) {
    Meteor.subscribe('posts');  
  }
}


TabularTables = {};

TabularTables.Posts = new Tabular.Table({
  bFilter: false,
  name: "Posts",
  collection: Posts,
  columns: [
    {width: "100px", data: "author", title: "Author"},
    {width: "450px", data: "content", title: "Content"}
  ]
});