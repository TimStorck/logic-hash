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
      author: "joe",
      content: "waza"
    },
    {
      author: "ben",
      content: "yes"
    }
  ];
  
  let length = postsArray.length;
  for (let i = 0; i < length; i++) {
    Meteor.call('posts.insert', postsArray[i]);
  }
} 