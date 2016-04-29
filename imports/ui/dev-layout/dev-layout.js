import { Template } from 'meteor/templating';

import './dev-layout.html';
import '../../api/collections/methods.js';
import '../../api/tabular/tbl-posts.js';

Template.devLayout.events ({
  "click #btn-tbl": function() {
    FlowRouter.go("dev");
  },
  "click #btn-add": function() {
    FlowRouter.go("dev_add");
  },
  "click #btn-add-doc": function() {
    console.log("btn-add-doc clicked");
    Meteor.call('posts.insert', {content: "test content", author: "test author"});
  },
  "click #btn-add-100": function() {
    console.log("btn-add-100 clicked");
    for (var i = 0; i < 100; i++) {
      Meteor.call('posts.insert', {content: "test content", author: "test author"});
    }
  },
  "click #btn-rem-all": function() {
    console.log("btn-rem-all clicked");
    Meteor.call('posts.removeAll');
  },
  "click #btn-tst": function() {
    console.log("btn-tst clicked");
    FlowRouter.go("dev_test");
  },
  "click #btn-cvs": function() {
    console.log("btn-cvs clicked");
    FlowRouter.go("sandbox");
  },
  "click #btn-line": function() {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    const points = [[450,300],[450,100],[450,500],[450,300],[800,300],[100,300]];
    for (var i = 1; i < points.length; i++) {
      ctx.moveTo(points[i-1][0],points[i-1][1]);
      ctx.lineTo(points[i][0],points[i][1]);
      ctx.stroke();
    }
  },
  "click #btn-fill": function() {
    const c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "rgb(210,210,210)";
    ctx.fillRect(0,0,899,599);
  }
});
