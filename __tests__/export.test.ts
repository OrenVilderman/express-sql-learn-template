import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it, afterAll } from '@jest/globals';
import indexRouter from '../routes/index';
import { QueryAPIService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Export Tests Suite', () => {
  afterAll(async () => {
    /**
     * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
     */
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  describe('Add Data To Tables', () => {
    afterAll(async () => {
      /**
       * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
       */
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    it('People, Winners and Users', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();

      let createResponse;
      // People
      createResponse = await request(app).post('/api/V0.1/query/create');
      expect(createResponse.status).to.equal(201);
      createResponse = await request(app).post('/api/V0.1/query/create');
      expect(createResponse.status).to.equal(201);

      // Winners
      createResponse = await request(app).post('/api/V0.1/winner/create');
      expect(createResponse.status).to.equal(201);
      createResponse = await request(app).post('/api/V0.1/winner/create');
      expect(createResponse.status).to.equal(201);

      // Users
      createResponse = await request(app).post('/api/V0.1/user/create');
      expect(createResponse.status).to.equal(201);
      createResponse = await request(app).post('/api/V0.1/user/create');
      expect(createResponse.status).to.equal(201);
    });
  });

  describe('People', () => {
    afterAll(async () => {
      /**
       * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
       */
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    it('Export People JSON', async () => {
      const peopleExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/query/export').send({
          type: 'json',
          where: undefined,
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < peopleExportTable.rawHeaders.length; i += 2) {
        headersObj[`${peopleExportTable.rawHeaders[i]}`] = peopleExportTable.rawHeaders[i + 1];
      }
      expect(peopleExportTable.statusCode).to.equal(200);
      expect(headersObj['Content-Type']).to.equal('application/json; charset=UTF-8');
      const dataFromPeople = JSON.parse(peopleExportTable.data);
      expect(dataFromPeople[0]).to.have.property('id').a('number');
      expect(dataFromPeople[0]).to.have.property('dob').a('string');
      expect(dataFromPeople[0]).to.have.property('email').a('string');
      expect(dataFromPeople[0]).to.have.property('gender').a('string');
      expect(dataFromPeople[0]).to.have.property('name').a('string');
      expect(dataFromPeople[0]).to.have.property('picture').a('string');
      expect(dataFromPeople[0]).to.have.property('role').a('string');
      expect(dataFromPeople[0]).to.have.property('uuid').a('string');
    });

    it('Export People JSON With Where (Negative)', async () => {
      const peopleExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/query/export').send({
          type: undefined,
          where: 'id=0',
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < peopleExportTable.rawHeaders.length; i += 2) {
        headersObj[`${peopleExportTable.rawHeaders[i]}`] = peopleExportTable.rawHeaders[i + 1];
      }
      expect(peopleExportTable.statusCode).to.equal(500);
      expect(headersObj['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(peopleExportTable.data).to.include('Error: Export people failed!');
    });
  });

  describe('Winners', () => {
    afterAll(async () => {
      /**
       * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
       */
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    it('Export Winners CSV', async () => {
      const winnersExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/winner/export').send({
          type: 'csv',
          where: undefined,
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < winnersExportTable.rawHeaders.length; i += 2) {
        headersObj[`${winnersExportTable.rawHeaders[i]}`] = winnersExportTable.rawHeaders[i + 1];
      }
      expect(winnersExportTable.statusCode).to.equal(200);
      expect(headersObj['Content-Type']).to.equal('text/csv; charset=UTF-8');
      expect(winnersExportTable.data).to.include('id,lucky_number,join_date');
    });

    it('Export Winners CSV With Where (Negative)', async () => {
      const winnersExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/winner/export').send({
          type: 'csv',
          where: 'name=NotExistTest',
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < winnersExportTable.rawHeaders.length; i += 2) {
        headersObj[`${winnersExportTable.rawHeaders[i]}`] = winnersExportTable.rawHeaders[i + 1];
      }
      expect(winnersExportTable.statusCode).to.equal(500);
      expect(headersObj['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(winnersExportTable.data).to.include('Error: Export winners failed!');
    });
  });

  describe('Users', () => {
    afterAll(async () => {
      /**
       * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
       */
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    it('Export Users Text With Where', async () => {
      const usersExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/user/export').send({
          type: 'text',
          where: 'luck=0',
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < usersExportTable.rawHeaders.length; i += 2) {
        headersObj[`${usersExportTable.rawHeaders[i]}`] = usersExportTable.rawHeaders[i + 1];
      }
      expect(usersExportTable.statusCode).to.equal(200);
      expect(headersObj['Content-Type']).to.equal('text/plain; charset=UTF-8');
      const dataFromUsers = JSON.parse(usersExportTable.data);
      expect(dataFromUsers[0]).to.have.property('id').a('number');
      expect(dataFromUsers[0]).to.have.property('join_date').a('string');
      expect(dataFromUsers[0]).to.have.property('luck').a('number');
    });

    it('Export Users Text With Where (Negative)', async () => {
      const usersExportTable: any = await new Promise(async (resolve) => {
        await request(app).post('/api/V0.1/user/export').send({
          type: 'text',
          where: 'luck=2',
        })
          .buffer()
          .parse((res: any, callback) => {
            res.setEncoding('binary');
            res.data = '';
            res.on('data', (chunk: any) => {
              res.data += chunk;
            });
            res.on('end', () => {
              callback(null, Buffer.from(res.data, 'binary'));
              resolve(res);
            });
          });
      });
      const headersObj: any = {};
      for (let i = 0; i < usersExportTable.rawHeaders.length; i += 2) {
        headersObj[`${usersExportTable.rawHeaders[i]}`] = usersExportTable.rawHeaders[i + 1];
      }
      expect(usersExportTable.statusCode).to.equal(500);
      expect(headersObj['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(usersExportTable.data).to.include('Error: Export users failed!');
    });
  });
});
