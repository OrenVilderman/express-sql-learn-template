import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it, afterAll } from '@jest/globals';
import indexRouter from '../routes/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Routes Tests Suite', () => {
  afterAll(async () => {
    /**
     * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
     */
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  describe('People', () => {
    it('Validate Non Existing Route', async () => {
      const peopleNonExistingRoute = await request(app).put('/api/V0.1/query');
      expect(peopleNonExistingRoute.status).to.equal(404);
      expect(peopleNonExistingRoute.text).to.equal('<h1>Query page not found</h1><p>For this uri: /, with method of: PUT</p>');
      expect(peopleNonExistingRoute.type).to.equal('text/html');
    });
  });

  describe('Winners', () => {
    it('Validate Non Existing Route', async () => {
      const winnerNonExistingRoute = await request(app).put('/api/V0.1/winner');
      expect(winnerNonExistingRoute.status).to.equal(404);
      expect(winnerNonExistingRoute.text).to.equal('<h1>Winner page not found</h1><p>For this uri: /, with method of: PUT</p>');
      expect(winnerNonExistingRoute.type).to.equal('text/html');
    });
  });

  describe('Users', () => {
    it('Validate Non Existing Route', async () => {
      const userNonExistingRoute = await request(app).put('/api/V0.1/user');
      expect(userNonExistingRoute.status).to.equal(404);
      expect(userNonExistingRoute.text).to.equal('<h1>User page not found</h1><p>For this uri: /, with method of: PUT</p>');
      expect(userNonExistingRoute.type).to.equal('text/html');
    });
  });
});
