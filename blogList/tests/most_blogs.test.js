const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('author that have most blogs', () => {
  const listWithBlogs = [
    {
      author: 'Edsger W. Dijkstra',
      blogs: 7,
    },
    {
      author: 'Edsger W. Dijkstra',
      blogs: 10,
    },
    {
      author: 'Edsger W. Dijkstra',
      blogs: 3,
    },
  ];

  test('compare the array of blogs to find the author that have most blogs', () => {
    const result = listHelper.mostBlogs(listWithBlogs);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 3 });
  });
});
