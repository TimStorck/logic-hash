import { Meteor } from 'meteor/meteor';

import '../collections.js';

TabularTables = {};

TabularTables.Posts = new Tabular.Table({
  bFilter: false,
  bAutoWidth: false,
  autoWidth: false,
  name: "Posts",
  collection: Posts,
  columns: [
    {sWidth: "50%", data: "content", title: "Content"},
    {sWidth: "50%", data: "author", title: "Author"}
  ]
});