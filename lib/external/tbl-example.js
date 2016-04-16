import { Meteor } from 'meteor/meteor';

import '../collections.js';

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