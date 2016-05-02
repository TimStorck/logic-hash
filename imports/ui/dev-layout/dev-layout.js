import { Template } from 'meteor/templating';

import './dev-layout.html';
import '../../api/collections/methods.js';
import '../../api/tabular/tbl-posts.js';
import {thing} from '../../api/reactive/reactive-thing.js';
import { ReactiveDict } from 'meteor/reactive-dict';

// import { sandCanObj } from '../dev-sandbox/dev-sandbox.js';
import { sandCtx } from '../dev-sandbox/dev-sandbox.js';

const dict = new ReactiveDict();
dict.set("thing", thing("qFFbm4wRNPnqMfBQG"));
Tracker.autorun(function () { console.log(thing("qFFbm4wRNPnqMfBQG")); });

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
  "click #btn-add-10": function() {
    FlowRouter.go("dev_add_ten");
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
