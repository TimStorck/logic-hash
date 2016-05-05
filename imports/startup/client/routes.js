import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { home } from '../../ui/home/home.js';
import { devLayout } from '../../ui/dev-layout/dev-layout.js';
import { devTable } from '../../ui/dev-table/dev-table.js';
import { devAdd } from '../../ui/dev-add/dev-add.js';
import { devAddTen } from '../../ui/dev-add/dev-add.js';
import { devTest } from '../../ui/dev-test/dev-test.js';
import { sandbox } from '../../ui/dev-sandbox/dev-sandbox.js';
import { signUp } from '../../ui/signup/signup.js';
import { newMotion } from '../../ui/new-motion/new-motion.js';
import { debate } from '../../ui/debate/debate.js';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("home");
    }
});

FlowRouter.route('/debate', {
    name: 'debate',
    action: function() {
        BlazeLayout.render("debate");
    }
});

FlowRouter.route('/new', {
    name: 'new_motion',
    action: function() {
        BlazeLayout.render("newMotion");
    }
});

FlowRouter.route('/signup', {
    name: 'sign_up',
    action: function() {
        BlazeLayout.render("signUp");
    }
});

FlowRouter.route('/dev/', {
    name: 'dev',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devTable"});
    }
});

FlowRouter.route('/dev/add', {
    name: 'dev_add',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devAdd"});
    }
});

FlowRouter.route('/dev/add-ten', {
    name: 'dev_add_ten',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devAddTen"});
    }
});

FlowRouter.route('/dev/test', {
    name: 'dev_test',
    action: function() {
        BlazeLayout.render("devLayout", {content: "devTest"});
    }
});

FlowRouter.route('/sandbox', {
    name: 'sandbox',
    action: function() {
        BlazeLayout.render("devLayout", {content: "sandbox"});
    }
});