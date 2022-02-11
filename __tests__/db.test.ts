import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';
import { QueryAPIService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('DB Tests Suite', () => {
  let winnerID: number;
  let userID: number;
  it('Validate Creaet And Remove Winner', async () => {
    const apiCreateWinner = await request(app).post('/api/V0.1/winner/create');
    winnerID = Number(apiCreateWinner.body[0].id);
    const apiDeletePerson = await request(app).delete(`/api/V0.1/query/${winnerID}`);
    expect(apiDeletePerson.status).to.equal(200);
    expect(apiDeletePerson.type).to.equal('application/json');
    expect(apiDeletePerson.body).to.have.property('deleted').a('boolean').that.is.true;
  });

  it('Validate Remvoe Winner (Negative)', async () => {
    const apiDeletePersonNegative = await request(app).delete(`/api/V0.1/query/${winnerID}`);
    expect(apiDeletePersonNegative.status).to.equal(404);
    expect(apiDeletePersonNegative.text).to.equal(`Person with id of: ${winnerID}, not found!`);
    expect(apiDeletePersonNegative.type).to.equal('text/html');
  });

  it('Validate Creat Two Users And Remove One', async () => {
    await request(app).post('/api/V0.1/user/create');
    const apiUsersBefore = await request(app).get('/api/V0.1/user/all');
    userID = Number(apiUsersBefore.body[0].id);
    await request(app).post('/api/V0.1/user/create');
    const apiUsersAfterCreate = await request(app).get('/api/V0.1/user/all');
    await request(app).delete(`/api/V0.1/query/${userID}`);
    const apiUsersAfterRemove = await request(app).get('/api/V0.1/user/all');
    expect(apiUsersBefore.body.length).to.be.above(0);
    expect(apiUsersAfterCreate.body.length).to.equal(apiUsersBefore.body.length + 1);
    expect(apiUsersAfterRemove.body.length).to.equal(apiUsersBefore.body.length);
  });

  it('Validate SQLite Execution Errors', async () => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let closedDBMessage;
    try {
      closedDBMessage = await queryAPIService.deleteRowFromTableById('test', 0);
    } catch (error) {
      if (error instanceof Error) {
        closedDBMessage = error.message;
      }
    }
    expect(closedDBMessage).to.equal('Error: SQLITE_ERROR: no such table: test');
  });
});
