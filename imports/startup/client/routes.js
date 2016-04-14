import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { home } from '../../ui/home/home.js';
import { layoutDev } from '../../ui/dev-layout/layout-dev.js';
import { devHome } from '../../ui/dev-home/dev-home.js';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("home");
    }
});

FlowRouter.route('/dev/', {
    name: 'dev',
    action: function() {
        BlazeLayout.render("layoutDev", {content: "devHome"});
    }
});