import {Posts} from '../../imports/api/posts.js';

TabularTables = {};

TabularTables.Posts = new Tabular.Table({
  name: "Posts",
  collection: Posts,
  columns: [
    {data: "title", title: "Title"},
    {data: "author", title: "Author"}
  ]
});