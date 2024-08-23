const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('author that have most likes', () => {
  const listWithBlogs = [
    {
      author: 'Edsger W. Dijkstra',
      blogs: 7,
      likes: 20,
    },
    {
      author: 'Edsger W. Dijkstra',
      blogs: 10,
      likes: 10,
    },
    {
      author: 'Edsger W. Dijkstra',
      blogs: 3,
      likes: 5,
    },
    {
      author: 'Edsger Dijkstra',
      blogs: 3,
      likes: 5,
    },
  ];

  test('compare the array of blogs to find the author that have most likes', () => {
    const result = listHelper.mostLikes(listWithBlogs);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 35 });
  });
});
