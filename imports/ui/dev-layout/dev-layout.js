import { Template } from 'meteor/templating';

import './dev-layout.html';
import '../../api/collections/methods.js';
import '../../api/tabular/tbl-posts.js';

import { sandCanObj } from '../dev-sandbox/dev-sandbox.js';
import { sandCtx } from '../dev-sandbox/dev-sandbox.js';

Template.devLayout.events ({
  "click #btn-tst": function() {
    console.log(sandCanObj);
  },
  /* table events begin */
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
  /* table events end */

  /* sandbox events begin */
  "click #btn-cvs": function() {
    console.log("btn-cvs clicked");
    FlowRouter.go("sandbox");
  },
  "click #btn-zero": function() {
    const line1 = [[0,-1000],[0,1000]];
    const line2 = [[-1000,0],[1000,0]];
    sandCtx.strokeStyle = "red";
    sandCtx.moveTo(line1[0][0],line1[0][1]);
    sandCtx.lineTo(line1[1][0],line1[1][1]);
    sandCtx.stroke();
    sandCtx.moveTo(line2[0][0],line2[0][1]);
    sandCtx.lineTo(line2[1][0],line2[1][1]);
    sandCtx.stroke();
  },
  "click #btn-line": function() {
    const points = [[450,300],[450,100],[450,500],[450,300],[800,300],[100,300]];
    for (var i = 1; i < points.length; i++) {
      sandCtx.moveTo(points[i-1][0],points[i-1][1]);
      sandCtx.lineTo(points[i][0],points[i][1]);
      sandCtx.stroke();
    }
  },
  "click #btn-lin2": function() {
    const points = [[450,300],[450,1000]];
    sandCtx.moveTo(points[0][0],points[0][1]);
    sandCtx.lineTo(points[1][0],points[1][1]);
    sandCtx.stroke();
  },
  "click #btn-fill": function() {
    sandCtx.fillStyle = "rgb(210,210,210)";
    sandCtx.fillRect(0,0,899,599);
  }
  /* sandbox events end */
});
