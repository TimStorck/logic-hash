import { Posts } from './posts.js';
import { Settings } from './settings.js';
import { Meteor } from 'meteor/meteor';
import { postsArray } from '../../data/dummy-posts.js';
import { defaultSettings } from '../../data/defaultSettings.js';
import { globalWarmingResponses } from '../../data/dummy-posts.js';
import { nukesResponses } from '../../data/dummy-posts.js';
import { defeatistResponses } from '../../data/dummy-posts.js';

Meteor.methods({
  'posts.insert': function(postParam) {
    if (postParam.elicitor == null || postParam.elicitor == "") {
      postParam.dateDiscussed = Date.parse(Date());
      postParam.dateMade = Date.parse(Date());
    } else {
      //TODO make below coniditonal update recursive
      Posts.update({_id: postParam.elicitor}, {$set: {dateDiscussed: Date.parse(Date())} } );
    }
    Posts.insert(postParam);
  },
  'posts.removeAll': function() {
    Posts.remove({});
  },
  'posts.remove': function(idString) {
    Posts.remove({_id: idString});
  },
  'posts.loadDummy': function() {
    postsLength = postsArray.length;
    for (let i = 0; i < postsLength; i++) {
      Meteor.call('posts.insert', postsArray[i]);
    }

    let globalWarmingId = Posts.findOne({content: "Global warming is the most important issue facing civilization."})._id;
    globalResponsesLength = globalWarmingResponses.length;
    for (let i = 0; i < globalResponsesLength; i++) {
      globalWarmingResponses[i].elicitor = globalWarmingId;
      Posts.insert(globalWarmingResponses[i]);
    }

    let nukesId = Posts.findOne({content: "Nuclear weapons are a greater threat than global warming."})._id;
    nukesLength = nukesResponses.length;
    for (let i = 0; i < nukesLength; i++) {
      nukesResponses[i].elicitor = nukesId;
      Posts.insert(nukesResponses[i]);
    }

    let defeatistId = Posts.findOne({content: "It's all over, enjoy the ride."})._id;
    defeatistLength = defeatistResponses.length;
    for (let i = 0; i < defeatistLength; i++) {
      defeatistResponses[i].elicitor = defeatistId;
      Posts.insert(defeatistResponses[i]);
    }
  },
  'settings.loadDefault': function() {
    Settings.remove({});
    for (let i = 0; i < defaultSettings.length; i++) {
      Settings.insert(defaultSettings[i]);
    }
    console.log("default settings loaded");
  },
  'settings.toggleOutline': function() {
    if (Settings.findOne({name: "drawOutline"}).value) {
      Settings.update({name: "drawOutline"}, {$set: {value: false}});
    } else {
      Settings.update({name: "drawOutline"}, {$set: {value: true}});
    }
  },
  'settings.toggleOutlineDebug': function() {
    if (Settings.findOne({name: "drawOutlineEachBox"}).value) {
      Settings.update({name: "drawOutlineEachBox"}, {$set: {value: false}});
    } else {
      Settings.update({name: "drawOutlineEachBox"}, {$set: {value: true}});
    }
  },
  'settings.toggleArea': function() {
    if (Settings.findOne({name: "drawAreaToCheck"}).value) {
      Settings.update({name: "drawAreaToCheck"}, {$set: {value: false}});
    } else {
      Settings.update({name: "drawAreaToCheck"}, {$set: {value: true}});
    }
  },
  'settings.toggleLine': function() {
    if (Settings.findOne({name: "drawLineBeingChecked"}).value) {
      Settings.update({name: "drawLineBeingChecked"}, {$set: {value: false}});
    } else {
      Settings.update({name: "drawLineBeingChecked"}, {$set: {value: true}});
    }
  }
})
