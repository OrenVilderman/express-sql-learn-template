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
    expect(publicIndex.status).to.equal(201);
    expect(publicIndex.type).to.equal('text/html');
    expect(publicIndex.text).to.include('<h1>TypeScript Express SQL Public UI</h1>');
  });

  it('All People', async () => {
    const apiAllPeopleAll = await request(app).get('/api/V0.1/query/all');
    expect(apiAllPeopleAll.status).to.equal(200);
    expect(apiAllPeopleAll.type).to.equal('application/json');
    expect(apiAllPeopleAll.body[0]).to.have.property('id').a('number');
    expect(apiAllPeopleAll.body[0]).to.have.property('dob').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('email').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('gender').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('name').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('picture').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('role').a('string');
    expect(apiAllPeopleAll.body[0]).to.have.property('uuid').a('string');
  });

  it('All Winners', async () => {
    const apiAllWinnersAll = await request(app).get('/api/V0.1/winner/all');
    expect(apiAllWinnersAll.status).to.equal(200);
    expect(apiAllWinnersAll.type).to.equal('application/json');
    expect(apiAllWinnersAll.body[0]).to.have.property('id').a('number');
    expect(apiAllWinnersAll.body[0]).to.have.property('lucky_number').a('number');
    expect(apiAllWinnersAll.body[0]).to.have.property('join_date').a('string');
  });

  it('All Users', async () => {
    const apiAllUsersAll = await request(app).get('/api/V0.1/user/all');
    expect(apiAllUsersAll.status).to.equal(200);
    expect(apiAllUsersAll.type).to.equal('application/json');
    expect(apiAllUsersAll.body[0]).to.have.property('id').a('number');
    expect(apiAllUsersAll.body[0]).to.have.property('luck').a('number');
    expect(apiAllUsersAll.body[0]).to.have.property('join_date').a('string');
  });

  it('Page Not Found', async () => {
    const pageNotFound = await request(app).get('/api/V0.1/error');
    expect(pageNotFound.status).to.equal(404);
    expect(pageNotFound.type).to.equal('text/html');
    expect(pageNotFound.text).to.include('<h1>Page not found</h1><p>For this uri: /error, with method of: GET</p>');
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
    expect(winnerNotFound.text).to.include('Winner with id of: NaN, not found!');
  });

  it('User Not Found', async () => {
    const userNotFound = await request(app).get('/api/V0.1/user/error');
    expect(userNotFound.status).to.equal(404);
    expect(userNotFound.type).to.equal('text/html');
    expect(userNotFound.text).to.include('User with id of: NaN, not found!');
  });
});
