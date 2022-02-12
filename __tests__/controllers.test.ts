import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';
import { QueryAPIService } from '../services';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Controllers Tests Suite', () => {
  describe('Clean', () => {
    it('Drop All Tables', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      await queryAPIService.dropTableByName('');

      const peopleTable = await request(app).get('/api/V0.1/query/all');
      expect(peopleTable.status).to.equal(404);
      expect(peopleTable.text).to.equal('People table is empty!');

      const winnerTable = await request(app).get('/api/V0.1/winner/all');
      expect(winnerTable.status).to.equal(404);
      expect(winnerTable.text).to.equal('Winners table is empty!');

      const userTable = await request(app).get('/api/V0.1/user/all');
      expect(userTable.status).to.equal(404);
      expect(userTable.text).to.equal('Users table is empty!');
    });
  });

  describe('People', () => {
    it('Get Empty Table', async () => {
      const peopleEmptyTable = await request(app).get('/api/V0.1/query/all');
      expect(peopleEmptyTable.status).to.equal(404);
      expect(peopleEmptyTable.text).to.equal('People table is empty!');
      expect(peopleEmptyTable.type).to.equal('text/html');
    });

    it('Get Non Existing By UUID', async () => {
      const peopleWrongUUID = await request(app).get('/api/V0.1/query/0');
      expect(peopleWrongUUID.status).to.equal(404);
      expect(peopleWrongUUID.text).to.equal('Person with uuid of: 0, not found!');
      expect(peopleWrongUUID.type).to.equal('text/html');
    });

    it('CRUD', async () => {
      const peopleCreate = await request(app).post('/api/V0.1/query/create');
      expect(peopleCreate.status).to.equal(201);
      expect(peopleCreate.body[0]).to.be.an('object').that.is.not.null;
      expect(peopleCreate.type).to.equal('application/json');

      const peopleRead = await request(app).get(`/api/V0.1/query/${peopleCreate.body[0].uuid}`);
      expect(peopleRead.status).to.equal(200);
      expect(peopleRead.body[0]).to.be.an('object').that.is.not.null;
      expect(peopleRead.type).to.equal('application/json');
      expect(peopleCreate.body[0]).to.deep.equal(peopleRead.body[0]);

      const peopleUpdate = await request(app).patch(`/api/V0.1/query/${peopleCreate.body[0].uuid}`).send({
        name: 'TestName',
        role: 'TestRole',
        gender: 'TestGender',
        picture: 'TestPicture',
        email: 'TestEmail',
      });
      expect(peopleUpdate.body[0]).to.have.property('id').equal(peopleRead.body[0].id);
      expect(peopleUpdate.body[0]).to.have.property('dob').equal(peopleRead.body[0].dob);
      expect(peopleUpdate.body[0]).to.have.property('email').equal('TestEmail');
      expect(peopleUpdate.body[0]).to.have.property('gender').equal('TestGender');
      expect(peopleUpdate.body[0]).to.have.property('name').equal('TestName');
      expect(peopleUpdate.body[0]).to.have.property('picture').equal('TestPicture');
      expect(peopleUpdate.body[0]).to.have.property('role').equal('TestRole');
      expect(peopleUpdate.body[0]).to.have.property('uuid').equal(peopleRead.body[0].uuid);

      const peopleGetBefore = await request(app).get('/api/V0.1/query?name=TestName');
      expect(peopleGetBefore.status).to.equal(200);
      expect(peopleGetBefore.body[0]).to.be.an('object').that.is.not.null;
      expect(peopleGetBefore.type).to.equal('application/json');

      const peopleDelete = await request(app).delete(`/api/V0.1/query/${peopleCreate.body[0].id}`);
      expect(peopleDelete.body).to.have.property('deleted').a('boolean').that.is.true;
      expect(peopleDelete.status).to.equal(200);
      expect(peopleDelete.type).to.equal('application/json');

      const peopleGetAfter = await request(app).get('/api/V0.1/query?name=TestName');
      expect(peopleGetAfter.status).to.equal(404);
      expect(peopleGetAfter.text).to.equal('Person with name of: TestName, not found!');
      expect(peopleGetAfter.type).to.equal('text/html');
    });
  });

  describe('Winners', () => {
    it('Get Empty Table', async () => {
      const winnersEmptyTable = await request(app).get('/api/V0.1/winner/all');
      expect(winnersEmptyTable.status).to.equal(404);
      expect(winnersEmptyTable.text).to.equal('Winners table is empty!');
      expect(winnersEmptyTable.type).to.equal('text/html');
    });

    it('Get Non Existing By ID', async () => {
      const winnersWrongUUID = await request(app).get('/api/V0.1/winner/0');
      expect(winnersWrongUUID.status).to.equal(404);
      expect(winnersWrongUUID.text).to.equal('Winner with id of: 0, not found!');
      expect(winnersWrongUUID.type).to.equal('text/html');
    });

    it('CRUD', async () => {
      const winnersCreate = await request(app).post('/api/V0.1/winner/create');
      expect(winnersCreate.status).to.equal(201);
      expect(winnersCreate.body[0]).to.be.an('object').that.is.not.null;
      expect(winnersCreate.type).to.equal('application/json');

      const winnersRead = await request(app).get(`/api/V0.1/winner/${winnersCreate.body[0].id}`);
      expect(winnersRead.status).to.equal(200);
      expect(winnersRead.body[0]).to.be.an('object').that.is.not.null;
      expect(winnersRead.type).to.equal('application/json');
      expect(winnersCreate.body[0]).to.deep.equal(winnersRead.body[0]);

      const winnersUpdate = await request(app).patch(`/api/V0.1/winner/${winnersCreate.body[0].id}`).send({
        luckyNumber: 555,
      });
      expect(winnersUpdate.body[0]).to.have.property('id').equal(winnersRead.body[0].id);
      expect(winnersUpdate.body[0]).to.have.property('join_date').equal(winnersRead.body[0].join_date);
      expect(winnersUpdate.body[0]).to.have.property('lucky_number').equal(555);

      const winnersGetBefore = await request(app).get(`/api/V0.1/winner/${winnersUpdate.body[0].id}`);
      expect(winnersGetBefore.status).to.equal(200);
      expect(winnersGetBefore.body[0]).to.be.an('object').that.is.not.null;
      expect(winnersGetBefore.type).to.equal('application/json');

      const winnersDelete = await request(app).delete(`/api/V0.1/query/${winnersCreate.body[0].id}`);
      expect(winnersDelete.body).to.have.property('deleted').a('boolean').that.is.true;
      expect(winnersDelete.status).to.equal(200);
      expect(winnersDelete.type).to.equal('application/json');

      const winnersGetAfter = await request(app).get(`/api/V0.1/winner/${winnersUpdate.body[0].id}`);
      expect(winnersGetAfter.status).to.equal(404);
      expect(winnersGetAfter.text).to.equal(`Winner with id of: ${winnersUpdate.body[0].id}, not found!`);
      expect(winnersGetAfter.type).to.equal('text/html');
    });
  });

  describe('Users', () => {
    it('Get Empty Table', async () => {
      const usersEmptyTable = await request(app).get('/api/V0.1/user/all');
      expect(usersEmptyTable.status).to.equal(404);
      expect(usersEmptyTable.text).to.equal('Users table is empty!');
      expect(usersEmptyTable.type).to.equal('text/html');
    });

    it('Get Non Existing By ID', async () => {
      const usersWrongUUID = await request(app).get('/api/V0.1/user/0');
      expect(usersWrongUUID.status).to.equal(404);
      expect(usersWrongUUID.text).to.equal('User with id of: 0, not found!');
      expect(usersWrongUUID.type).to.equal('text/html');
    });

    it('CRUD', async () => {
      const usersCreate = await request(app).post('/api/V0.1/user/create');
      expect(usersCreate.status).to.equal(201);
      expect(usersCreate.body[0]).to.be.an('object').that.is.not.null;
      expect(usersCreate.type).to.equal('application/json');

      const usersRead = await request(app).get(`/api/V0.1/user/${usersCreate.body[0].id}`);
      expect(usersRead.status).to.equal(200);
      expect(usersRead.body[0]).to.be.an('object').that.is.not.null;
      expect(usersRead.type).to.equal('application/json');
      expect(usersCreate.body[0]).to.deep.equal(usersRead.body[0]);

      const usersUpdate = await request(app).patch(`/api/V0.1/user/${usersRead.body[0].id}`).send({
        luck: true,
      });
      expect(usersUpdate.body[0]).to.have.property('id').equal(usersRead.body[0].id);
      expect(usersUpdate.body[0]).to.have.property('join_date').equal(usersRead.body[0].join_date);
      expect(usersUpdate.body[0]).to.have.property('luck').equal(1);

      const usersGetBefore = await request(app).get(`/api/V0.1/user/${usersUpdate.body[0].id}`);
      expect(usersGetBefore.status).to.equal(200);
      expect(usersGetBefore.body[0]).to.be.an('object').that.is.not.null;
      expect(usersGetBefore.type).to.equal('application/json');

      const usersDelete = await request(app).delete(`/api/V0.1/query/${usersCreate.body[0].id}`);
      expect(usersDelete.body).to.have.property('deleted').a('boolean').that.is.true;
      expect(usersDelete.status).to.equal(200);
      expect(usersDelete.type).to.equal('application/json');

      const usersGetAfter = await request(app).get(`/api/V0.1/user/${usersUpdate.body[0].id}`);
      expect(usersGetAfter.status).to.equal(404);
      expect(usersGetAfter.text).to.equal(`User with id of: ${usersUpdate.body[0].id}, not found!`);
      expect(usersGetAfter.type).to.equal('text/html');
    });
  });
});
