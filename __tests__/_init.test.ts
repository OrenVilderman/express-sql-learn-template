import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Initiation Tests Suite', () => {
  it('Create People', async () => {
    const createPeopleResponse = await request(app).post('/api/V0.1/query/create');
    expect(createPeopleResponse.status).to.equal(201);
    expect(createPeopleResponse.type).to.equal('application/json');
    expect(createPeopleResponse.body[0]).to.have.property('id').a('number');
    expect(createPeopleResponse.body[0]).to.have.property('dob').a('string');
    expect(createPeopleResponse.body[0]).to.have.property('email').a('string');
    expect(createPeopleResponse.body[0]).to.have.property('gender').a('string');
    expect(createPeopleResponse.body[0]).to.have.property('name').a('string');
    expect(createPeopleResponse.body[0]).to.have.property('picture').a('string');
    expect(createPeopleResponse.body[0]).to.have.property('role').a.null;
    expect(createPeopleResponse.body[0]).to.have.property('uuid').a('string');
  });

  it('Create Winner', async () => {
    const createWinnerResponse = await request(app).post('/api/V0.1/winner/create');
    expect(createWinnerResponse.status).to.equal(201);
    expect(createWinnerResponse.type).to.equal('application/json');
    expect(createWinnerResponse.body[0]).to.have.property('id').a('number');
    expect(createWinnerResponse.body[0]).to.have.property('join_date').a('string');
    expect(createWinnerResponse.body[0]).to.have.property('lucky_number').a('number');
  });

  it('Create User', async () => {
    const createUserResponse = await request(app).post('/api/V0.1/user/create');
    await request(app).post('/api/V0.1/user/create');
    await request(app).post('/api/V0.1/user/create');
    await request(app).post('/api/V0.1/user/create');
    await request(app).post('/api/V0.1/user/create');

    expect(createUserResponse.status).to.equal(201);
    expect(createUserResponse.type).to.equal('application/json');
    expect(createUserResponse.body[0]).to.have.property('id').a('number');
    expect(createUserResponse.body[0]).to.have.property('join_date').a('string');
    expect(createUserResponse.body[0]).to.have.property('luck').a('number');
  });
});
