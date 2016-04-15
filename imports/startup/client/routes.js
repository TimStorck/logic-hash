import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { home } from '../../ui/home/home.js';
import { devLayout } from '../../ui/dev-layout/dev-layout.js';
import { devHome } from '../../ui/dev-home/dev-home.js';
import { devAdd } from '../../ui/dev-add/dev-add.js';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("home");
    }
});

FlowRouter.route('/dev/', {
    name: 'dev',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devHome"});
    }
});

FlowRouter.route('/dev/add', {
    name: 'dev_add',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devAdd"});
    }
});