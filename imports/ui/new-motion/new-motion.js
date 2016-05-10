import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './new-motion.html';

Template.newMotion.events({
  'submit #newMotion' : function(event, template) {

    event.preventDefault();

    const author = Meteor.user().username;
    const content = template.find('#text').value;

    const newPost = {
      content: content,
      author: author
    }

    Meteor.call('posts.insert', newPost);

    FlowRouter.go("home");
  }
});