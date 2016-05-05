import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'

import './new-motion.html';

Template.newMotion.events({
  'submit #newMotion' : function(event, template) {

    event.preventDefault();

    const email = template.find('#email').value;
    const username = template.find('#username').value;
    const password = template.find('#password').value;
    const confirmPassword = template.find('#confirmPassword').value;

    //method
  }
});