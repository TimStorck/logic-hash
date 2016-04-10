import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { home } from '../../ui/home/home.js';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("home");
    }
});