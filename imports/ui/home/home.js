import { Template } from 'meteor/templating';

import './home.html';

Template.home.helpers({
  recentlyAdded: [
    { text: 'added 1' },
    { text: 'added 2' },
    { text: 'added 3' },
  ],
  recentlyActive: [
    { text: 'active 1' },
    { text: 'active 2' },
    { text: 'active 3' },
  ]
});