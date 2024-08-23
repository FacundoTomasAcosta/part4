const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const blogsLikes = blogs.map((blog) => {
    return blog.likes;
  });
  return blogsLikes.reduce((a, b) => a + b, 0);
};

const favoriteBlog = (blogs) => {
  const blogsLikes = blogs.map((blog) => {
    return blog.likes;
  });
  const favoriteBlog = blogsLikes.indexOf(Math.max(...blogsLikes));
  return blogs[favoriteBlog];
};

const mostBlogs = (blogs) => {
  const groupAuthors = _.groupBy(blogs, 'author');
  const listOfAuthors = Object.keys(groupAuthors);
  const totalBlogs = Object.values(groupAuthors).map(
    (authorBlogs) => authorBlogs.length
  );
  const i = totalBlogs.indexOf(Math.max(...totalBlogs));
  return { author: listOfAuthors[i], blogs: totalBlogs[i] };
};

const mostLikes = (blogs) => {
  const groupAuthors = _.groupBy(blogs, 'author');
  const listOfAuthors = Object.keys(groupAuthors);
  const listOfLikes = Object.values(groupAuthors).map((blog) => {
    return blog.reduce((acc, blog) => acc + blog.likes, 0);
  });
  const i = listOfLikes.indexOf(Math.max(...listOfLikes));
  return { author: listOfAuthors[i], likes: listOfLikes[i] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
