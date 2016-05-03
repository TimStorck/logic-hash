import '../collections/methods.js';

// export const postsArray = [
//   {
//     author: "joe",
//     content: "waza"
//   },
//   {
//     author: "ben",
//     content: "yes"
//   }
// ];

export function insertPosts() {
  const postsArray = [
    {
      author: "Joe",
      content: "I think that global warming is the most important issue facing civilization."
    },
    {
      author: "Ben",
      content: "Citizens should be allowed to vote on legislation from their computer."
    },
    {
      author: "Jennifer",
      content: "Nasa should receive 10x more funding in order to protect Earth from asteroids."
    },
    {
      author: "Melissa",
      content: "Rock climbing should be in the Olympics."
    },
    {
      author: "George",
      content: "Classical music history should be taught in public schools."
    },
    {
      author: "Ben From CT",
      content: "Congress needs to do something about the use of anti-biotics on livestock."
    },
    {
      author: "Joanne",
      content: "Internet piracy should be policed by a Federal agency."
    },
    {
      author: "Bethany",
      content: "Internet piracy should be policed by a Federal agency."
    },
    {
      author: "Fred",
      content: "Wikipedia is as reliable as anything else."
    },
    {
      author: "Zeb",
      content: "Dinosaur fossils could be a trick."
    },
    {
      author: "Debby",
      content: "Old trees should be protected by local governments."
    }
  ];
  
  let length = postsArray.length;
  for (let i = 0; i < length; i++) {
    Meteor.call('posts.insert', postsArray[i]);
  }
} 