import { Template } from 'meteor/templating';
import { Posts } from '../../api/collections/posts.js';
import { Meteor } from 'meteor/meteor';
import { debateTreeChanged } from '../../functions/reactive.js';
import { flagData } from '../../data/flag-data.js';
import { findFlagObject } from '../../functions/drawing.js';
import { Settings } from '../../api/collections/settings.js';

import './debate.html';

let flagSelected = "";
let curYPos = 0,
    curXPos = 0,
    curDown = false;

Template.debate.onCreated(function() {
  this.elicitor = new ReactiveVar( "initialized, unassigned elicitor reactive var" );
  this.responseResponse = new ReactiveVar( false );
  $(window).on('mouseup', mouseUpHandler);
});

Template.debate.onDestroyed(function() {
  $(window).off('mouseup', mouseUpHandler);
});

Template.debate.onRendered(function() {
  Meteor.subscribe('posts');

  const handle = this.autorun(function () {
    debateTreeChanged(
      FlowRouter.getParam("mId"), 
      document.getElementById("bucket"), 
      document.getElementById("debateCanvas"),
      window.innerWidth - 50,
      window.innerHeight - 50
    );
  });

  /*
    for development
  */
  this.autorun(function() {
    try {
      if (Settings.findOne({name: "showCanvasOutline"}).value) {
        document.getElementById("canvasShell").style.padding="1px";
      } else {
        document.getElementById("canvasShell").style.padding="0";
      }
    } catch (e) {
    }
  });
});

Template.debate.events({
  'mousedown #debateCanvas': function(event) {
    curDown = true; 
    curYPos = event.pageY; 
    curXPos = event.pageX;
  },
  'mousemove #debateCanvas': function(event) {
    if(curDown === true){
     $(window).scrollTop($(window).scrollTop() + (curYPos - event.pageY)); 
     $(window).scrollLeft($(window).scrollLeft() + (curXPos - event.pageX));
    }
  },
  'click .post': function(event) {
    // console.log("click post " + event.target.id);
  },
  'click .respondBtn': function(event, template) {
    if (event.currentTarget.parentNode.id === FlowRouter.getParam("mId")) {
      template.responseResponse.set( false );
    } else {
      template.responseResponse.set( true );
      template.elicitor.set(event.currentTarget.parentNode.id);
    }
    /*
      comment below lines out for easier testing
    */
    document.getElementById("newResponse").reset();
    flagSelected = "";
    resetFlagItalics();
    document.getElementById("flagOptionBox").style.display = "none";
    clearFlagInResponseBox();
  },
  'mouseover .flagBox': function(event, template) {
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.display = "block";
    if (withinBoundsHor(event)) {
      document.getElementById("fm-" + event.currentTarget.parentNode.id).style.left = event.pageX + 'px';
    } else {
      document.getElementById("fm-" + event.currentTarget.parentNode.id).style.left = (event.pageX - 300) + 'px';
    }
    if (withinBoundsVert(event)) {
      document.getElementById("fm-" + event.currentTarget.parentNode.id).style.top = event.pageY + 'px';
    } else {
      document.getElementById("fm-" + event.currentTarget.parentNode.id).style.top = (event.pageY - 150) + 'px';
    }
  },
  'mouseout .flagBox': function(event, template) {
    document.getElementById("fm-" + event.currentTarget.parentNode.id).style.display = "none";
  },
  'submit #newResponse' : function(event, template) {
    event.preventDefault();

    const author = Meteor.user().username;
    const content = template.find('#responseText').value;
    let newPost;
    if (Template.instance().responseResponse.get()) {
      newPost = {
        content: content,
        author: author,
        elicitor: Template.instance().elicitor.get(),
        flag: flagSelected
      }
    } else {
      newPost = {
        content: content,
        author: author,
        elicitor: FlowRouter.getParam("mId"),
        flag: flagSelected
      }
    }
    Meteor.call('posts.insert', newPost);
    /*
      comment below lines out for easier testing
    */
    template.responseResponse.set( false );
    document.getElementById("newResponse").reset();
    flagSelected = "";
    resetFlagItalics();
    document.getElementById("flagOptionBox").style.display = "none";
    clearFlagInResponseBox();
  },
  'click .logoDiv': function(event) {
    FlowRouter.go("home");
  },
  'click #flagOptionBtn': function(event) {
    let flagOptionPanel = document.getElementById("flagOptionBox");
    if (flagOptionBox.style.display === "block") {
      flagOptionBox.style.display = "none";
    } else {
      flagOptionBox.style.display = "block";
    }
  }
});


Template.debate.events({
  'click .flagName': function(event) {
    if (flagSelected === this.name) {
      flagSelected = "";
      event.currentTarget.style.fontStyle = "normal";
      clearFlagInResponseBox();
    } else {
      flagSelected = this.name;
      resetFlagItalics();
      event.currentTarget.style.fontStyle = "italic";
      drawFlagInResponseBox(flagSelected);
    }
  }
});

Template.debate.helpers({
  responseResponse() {
    return Template.instance().responseResponse.get();
  },
  getElicitor() {
    return truncate(Posts.findOne({"_id": Template.instance().elicitor.get()}).content);
  },
  getFlags: flagData
});

function truncate(string) {
  if (string.length > 40) {
    //truncates to last space character before 40th character
    return string.substring(0,string.lastIndexOf(" ", 40)) + " ...";
  } else {
    return string;
  }
}

function resetFlagItalics() {
  let flagNameColl = document.getElementsByClassName("flagName");
  let iter;
  let fncLength = flagNameColl.length;
  for (iter=0; iter < fncLength; iter++) {
    flagNameColl[iter].style.fontStyle = "normal";
  }
}

function withinBoundsHor(event) {
  if(event.pageX < document.getElementById("debateCanvas").width - 250) {
    return true;
  }
  return false;
}

function withinBoundsVert(event) {
  if(event.pageY < document.getElementById("debateCanvas").height - 100) {
    return true;
  }
  return false;
}

function drawFlagInResponseBox(flagName) {
  document.getElementById("responseBoxFlag").style.border = "1px rgba(0,0,0,0.5) solid";
  document.getElementById("responseBoxFlag").style.backgroundColor = findFlagObject(flagName).color;
}

function clearFlagInResponseBox() {
  document.getElementById("responseBoxFlag").style.border = "none";
  document.getElementById("responseBoxFlag").style.backgroundColor = "transparent";
}

function mouseUpHandler() {
  curDown = false;
}