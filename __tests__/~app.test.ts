import request from 'supertest';
import { expect } from 'chai';
import { describe, it, afterAll } from '@jest/globals';
import server, { app } from '../app';

describe('Sanity Tests Suite', () => {
  // afterAll(async () => {
  //   server.close();
  // });

  it('Public Index', async () => {
    const publicIndex = await request(app).get('/index.html');
    expect(publicIndex.status).to.equal(200);
    expect(publicIndex.type).to.equal('text/html');
    expect(publicIndex.text).to.include('<h1>TypeScript Express SQL Public UI</h1>');
  });

  it('App Page Not Found', async () => {
    const appNotFound = await request(app).get('/error');
    expect(appNotFound.status).to.equal(404);
    expect(appNotFound.type).to.equal('text/html');
    expect(appNotFound.text).to.include('<h1>Page not found</h1>');
  });
});
