import { Posts } from './posts.js';
import { Flags } from './flags.js';
import { Meteor } from 'meteor/meteor';
import { postsArray } from '../../data/dummy-posts.js';
import { globalWarmingResponses } from '../../data/dummy-posts.js';
import { nukesResponses } from '../../data/dummy-posts.js';
import { defeatistResponses } from '../../data/dummy-posts.js';
import { flagData } from '../../data/flag-data.js';

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
  'flags.loadData': function() {
    flagsLength = flagData.length;
    for (let i = 0; i < flagsLength; i++) {
      Meteor.call('flags.insert', flagData[i]);
    }
  },
  'flags.insert': function(flagParam) {
    Flags.insert(flagParam);
  },
  'flags.removeAll': function() {
    Flags.remove({});
  }
})
