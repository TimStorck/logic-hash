import { Meteor } from 'meteor/meteor';

import '../collections.js';

TabularTables = {};

TabularTables.Posts = new Tabular.Table({
  name: "Posts",
  collection: Posts,
  columns: [
    {data: "content", title: "Content"},
    {data: "author", title: "Author"}
  ]
});