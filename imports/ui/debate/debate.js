import { Template } from 'meteor/templating';

import './debate.html';

Template.debate.onCreated(function() {
  let id = FlowRouter.getParam("mId");
  console.log(id); 
});