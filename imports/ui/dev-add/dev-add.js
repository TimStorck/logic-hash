import { Template } from 'meteor/templating';

import './dev-add.html';

Template.devAdd.events({
  'submit #submitAdd' : function(event, template) {

    event.preventDefault();

    const content = template.find('#content').value;
    const author = template.find('#author').value;

    const newPost = {
      content: content,
      author: author
    }

    Meteor.call('posts.insert', newPost);
  }
});
