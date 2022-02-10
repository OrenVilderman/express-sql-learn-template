import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';

const app = express();
app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));
app.use('/api/V0.1', indexRouter);

describe('Sanity Tests Suite', () => {
  it('Public Index', async () => {
    const publicIndex = await request(app).get('/index.html');
    expect(publicIndex.status).to.equal(200);
    expect(publicIndex.type).to.equal('text/html');
    expect(publicIndex.text).to.include('<h1>TypeScript Express SQL Public UI</h1>');
  });

  it('All People', async () => {
    const apiPeopleAll = await request(app).get('/api/V0.1/query/all');
    expect(apiPeopleAll.status).to.equal(200);
    expect(apiPeopleAll.type).to.equal('application/json');
    expect(apiPeopleAll.body[0]).to.have.property('id').a('number');
    expect(apiPeopleAll.body[0]).to.have.property('dob').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('email').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('gender').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('name').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('picture').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('role').a('string');
    expect(apiPeopleAll.body[0]).to.have.property('uuid').a('string');
  });

  it('All Winners', async () => {
    const apiWinnersAll = await request(app).get('/api/V0.1/winner/all');
    expect(apiWinnersAll.status).to.equal(200);
    expect(apiWinnersAll.type).to.equal('application/json');
    expect(apiWinnersAll.body[0]).to.have.property('id').a('number');
    expect(apiWinnersAll.body[0]).to.have.property('lucky_number').a('number');
    expect(apiWinnersAll.body[0]).to.have.property('join_date').a('string');
  });

  it('All Users', async () => {
    const apiUsersAll = await request(app).get('/api/V0.1/user/all');
    expect(apiUsersAll.status).to.equal(200);
    expect(apiUsersAll.type).to.equal('application/json');
    expect(apiUsersAll.body[0]).to.have.property('id').a('number');
    expect(apiUsersAll.body[0]).to.have.property('luck').a('number');
    expect(apiUsersAll.body[0]).to.have.property('join_date').a('string');
  });

  it('Page Not Found', async () => {
    const pageNotFound = await request(app).get('/api/V0.1/error');
    expect(pageNotFound.status).to.equal(404);
    expect(pageNotFound.type).to.equal('text/html');
    expect(pageNotFound.text).to.include('<h1>Page not found</h1><p>For this uri: /error</p>');
  });

  it('Person Not Found', async () => {
    const personNotFound = await request(app).get('/api/V0.1/query/error');
    expect(personNotFound.status).to.equal(404);
    expect(personNotFound.type).to.equal('text/html');
    expect(personNotFound.text).to.include('Person with uuid of: error, not found!');
  });

  it('Winner Not Found', async () => {
    const winnerNotFound = await request(app).get('/api/V0.1/winner/error');
    expect(winnerNotFound.status).to.equal(404);
    expect(winnerNotFound.type).to.equal('text/html');
    expect(winnerNotFound.text).to.include('Winner with uuid of: NaN, not found!');
  });

  it('User Not Found', async () => {
    const userNotFound = await request(app).get('/api/V0.1/user/error');
    expect(userNotFound.status).to.equal(404);
    expect(userNotFound.type).to.equal('text/html');
    expect(userNotFound.text).to.include('User with uuid of: NaN, not found!');
  });
});
