import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'

import './signup.html';

Template.signUp.events({
  'submit #signup' : function(event, template) {

    event.preventDefault();

    const email = template.find('#email').value;
    const username = template.find('#username').value;
    const password = template.find('#password').value;
    const confirmPassword = template.find('#confirmPassword').value;

    if (password === confirmPassword) {
      Accounts.createUser({username: username, email: email, password: password}, function(err) {
        console.log(err);
      });
    } else {
      document.getElementById("msg").innerHTML = "Passwords don't match";
    }
  }
});