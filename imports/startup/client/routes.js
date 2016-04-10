import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { home } from '../../ui/home/home.js';
import { layoutAdmin } from '../../ui/layout-admin/layout-admin.js';
import { adminHome } from '../../ui/admin-home/admin-home.js';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("home");
    }
});

FlowRouter.route('/admin/', {
    name: 'admin-home',
    action: function() {
        BlazeLayout.render("layoutAdmin", {content: "adminHome"});
    }
});