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
    {width: "130px", data: "elicitor", title: "Response To"},
    {width: "60px", data: "author", title: "Author"},
    {width: "130px", data: "content", title: "Content"},
    {width: "180px", data: "dateDiscussed", title: "Last Discussed"},
    {width: "180px", data: "flag", title: "flag"}
  ]
});