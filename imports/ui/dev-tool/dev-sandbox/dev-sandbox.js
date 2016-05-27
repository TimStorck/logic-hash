import { Template } from 'meteor/templating';

import './dev-sandbox.html';

// export let sandCanObj = new Object;
export let sandCtx = new Object;

Template.sandbox.onRendered( function() {
  sandCanObj = document.getElementById("devCanvas");
  sandCtx = sandCanObj.getContext("2d");
  sandCtx.translate(450,300);
});

