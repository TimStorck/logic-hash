export function PostOb(author, content) {
  this.content = content;
  this.author = author;
  this.testMethod = function() {
    console.log("method says hello")
  }
}