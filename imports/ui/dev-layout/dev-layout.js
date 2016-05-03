import { Template } from 'meteor/templating';

import './dev-layout.html';
import '../../api/collections/methods.js';
import '../../api/tabular/tbl-posts.js';
import {responseCount} from '../../api/reactive/reactive.js';

// import { sandCanObj } from '../dev-sandbox/dev-sandbox.js';
import { sandCtx } from '../dev-sandbox/dev-sandbox.js';

Tracker.autorun(function () { console.log("responses to qFFbm4wRNPnqMfBQG: " + responseCount("qFFbm4wRNPnqMfBQG")); });

Template.devLayout.events ({
  "click #btn-tst": function() {
      console.log(Date());
  },
  /* table events begin */
  "click #btn-tbl": function() {
    FlowRouter.go("dev");
  },
  "click #btn-add": function() {
    FlowRouter.go("dev_add");
  },
  "click #btn-add-doc": function() {
    Meteor.call('posts.insert', {content: "test content", author: "test author", date: Date()});
  },
  "click #btn-add-10": function() {
    FlowRouter.go("dev_add_ten");
  },
  "click #btn-rem-all": function() {
    Meteor.call('posts.removeAll');
  },
  /* table events end */

  /* sandbox events begin */
  "click #btn-cvs": function() {
    FlowRouter.go("sandbox");
  },
  "click #btn-zero": function() {
    const line1 = [[0,-1000],[0,1000]];
    const line2 = [[-1000,0],[1000,0]];
    sandCtx.beginPath();
    sandCtx.strokeStyle = "red";
    sandCtx.moveTo(line1[0][0],line1[0][1]);
    sandCtx.lineTo(line1[1][0],line1[1][1]);
    sandCtx.moveTo(line2[0][0],line2[0][1]);
    sandCtx.lineTo(line2[1][0],line2[1][1]);
    sandCtx.stroke();
    sandCtx.closePath();
  },
  "click #btn-clr": function() {
    sandCtx.fillStyle = "rgb(210,210,210)";
    sandCtx.fillRect(-1000,-1000,2000,2000);
  }
  /* sandbox events end */
});
