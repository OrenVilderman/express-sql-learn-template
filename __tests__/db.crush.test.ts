import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';
import { QueryAPIService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('DB Crush Tests Suite', () => {
  let userID: number;
  it('Validate Creaet And Remove User', async () => {
    const apiCreateUser = await request(app).post('/api/V0.1/user/create');
    userID = Number(apiCreateUser.body[0].id);
    const apiDeletePerson = await request(app).delete(`/api/V0.1/query/${userID}`);
    expect(apiDeletePerson.status).to.equal(200);
    expect(apiDeletePerson.type).to.equal('application/json');
    expect(apiDeletePerson.body).to.have.property('deleted').a('boolean').that.is.true;
  });

  it('Validate Remvoe User (Negative)', async () => {
    const apiDeletePersonNegative = await request(app).delete(`/api/V0.1/query/${userID}`);
    expect(apiDeletePersonNegative.status).to.equal(404);
    expect(apiDeletePersonNegative.text).to.equal(`Person with id of: ${userID}, not found!`);
    expect(apiDeletePersonNegative.type).to.equal('text/html');
  });

  it('Validate SQLite Close Errors (Crush Test)', async () => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    await queryAPIService.quitSQLite();
    let closedDBMessage;
    try {
      closedDBMessage = await queryAPIService.selectByQuery('Test SQL Query');
    } catch (error) {
      if (error instanceof Error) {
        closedDBMessage = error.message;
      }
    }
    expect(closedDBMessage).to.equal('DB not initiated');
  });
});
