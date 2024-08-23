const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });
  await user.save();
});

describe('GET blogs', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two notes', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('verifies that the blog posts unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs');

    const idExist = response.body[0].hasOwnProperty('id');

    assert.strictEqual(idExist, true);
  });
});

describe('POST blogs', () => {
  test('successfully create a new blog post and verifies that the total number of blogs in the system increases by one', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 9,
    };

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test('verifies that if the like property is missing from the request, it will have the value 0 by default', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    };

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const likes = blogsAtEnd.map((r) => r.likes);
    assert.strictEqual(likes[likes.length - 1], 0);
  });

  test('verify that if the title or url properties do not exist, it returns 400 bad request', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 14,
    };

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('DELETE blog', () => {
  test('blog can only deleted by the user creator', async () => {
    const newBlog = {
      title: 'Facundo book',
      author: 'Facundo Tomas Acosta',
      url: 'https://www.facundoacosta.com',
      likes: 1,
    };

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('UPDATE blog', () => {
  test('update likes', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      ...blogToUpdate,
      likes: 119,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd[0].likes, 119);
  });
});

after(async () => {
  await mongoose.connection.close();
});
