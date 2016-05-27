import { Template } from 'meteor/templating';
import { Settings } from '../../../api/collections/settings.js';

import './dev-layout.html';
import '../../../api/collections/methods.js';
import '../../../api/tabular/tbl-posts.js';

import { sandCtx } from '../dev-sandbox/dev-sandbox.js';

Template.devLayout.onCreated(function() {
  if (FlowRouter.subsReady()) {
    Meteor.subscribe('settings'); 
  }
});

Template.devLayout.onRendered(function() {
  document.body.style.backgroundColor = "rgb(200,200,200)";
});

Template.placementNav.events ({
  "click #btn-outline": function() {
    Meteor.call('settings.toggleOutline');
  },
  "click #btn-outline-debug": function() {
    Meteor.call('settings.toggleOutlineDebug');
  },
  "click #btn-area": function() {
    Meteor.call('settings.toggleArea');
  },
  "click #btn-lines": function() {
    Meteor.call('settings.toggleLine');
  }
});

Template.placementNav.helpers({
  showOutline: function () {
    try {
      if (Settings.findOne({name: "drawOutline"}).value) {
        return "selected";
      } else {
        return "";
      }
    } catch(e) {
      //throws an exception when first loading page
    }
  },
  showOutlineDebug: function () {
    try {
      if (Settings.findOne({name: "drawOutlineEachBox"}).value) {
        return "selected";
      } else {
        return "";
      }
    } catch(e) {
      //throws an exception when first loading page
    }
  },
  showArea: function () {
    try {
      if (Settings.findOne({name: "drawAreaToCheck"}).value) {
        return "selected";
      } else {
        return "";
      }
    } catch(e) {
      //throws an exception when first loading page
    }
  },
  showLine: function () {
    try {
      if (Settings.findOne({name: "drawLineBeingChecked"}).value) {
        return "selected";
      } else {
        return "";
      }
    } catch(e) {
      //throws an exception when first loading page
    }
  }
});

Template.devLayout.events ({
  "click #btn-sett": function() {
    Meteor.call("settings.loadDefault");
  },
});

Template.tableNav.events ({
  "click #btn-tbl": function() {
    FlowRouter.go("dev");
  },
  "click #btn-add": function() {
    FlowRouter.go("dev_add");
  },
  "click #btn-add-doc": function() {
    Meteor.call('posts.insert', {content: "test content", author: "test author"});
  },
  "click #btn-add-10": function() {
    FlowRouter.go("dev_add_ten");
  },
  "click #btn-rem-all": function() {
    Meteor.call('posts.removeAll');
  },
  "click #btn-rem": function() {
    FlowRouter.go("dev_rem");
  },
  "click #btn-dum": function() {
    Meteor.call('posts.loadDummy');
  }
});

Template.sandNav.events ({
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
});