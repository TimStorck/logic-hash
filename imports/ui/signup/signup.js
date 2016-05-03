import { Template } from 'meteor/templating';

import './signup.html';

Template.signUp.events({
  'submit #signup' : function(event, template) {

    event.preventDefault();

    const email = template.find('#email').value;
    const username = template.find('#username').value;
    const password = template.find('#password').value;
    const confirmPassword = template.find('#confirmPassword').value;

    if (password === confirmPassword) {
      
    } else {
      document.getElementById("msg").innerHTML = "Passwords don't match";
    }
  }
});