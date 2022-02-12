import express from 'express';
import { expect } from 'chai';
import { describe, it } from '@jest/globals';
import indexRouter from '../routes/index';
import { PeopleAPIService, QueryAPIService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Services Tests Suite', () => {
  describe('Query', () => {
    it('Re-Initiate DB And Validate USE', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      await queryAPIService.initiateSQLite();
      const isTableExist = await queryAPIService.isAsyncTableExist('people');
      expect(isTableExist).to.be.true;
    });

    it('Search For Non Existing Table', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      const isTableExist = await queryAPIService.isAsyncTableExist('test');
      expect(isTableExist).to.be.false;
    });

    it('Drop And Create Defult Table', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      let users;
      let noSuchTableDBMessage;
      expect(users).to.be.undefined;
      users = await queryAPIService.selectFromTable('users');
      expect(users).to.be.an('array');
      await queryAPIService.dropTableByName('users');
      try {
        users = await queryAPIService.selectFromTable('users');
      } catch (error) {
        if (error instanceof Error) {
          noSuchTableDBMessage = error.message;
        }
      }
      expect(noSuchTableDBMessage).to.equal('Error: SQLITE_ERROR: no such table: users');
      await queryAPIService.createDefultDBTablesIfMissing();
      users = undefined;
      expect(users).to.be.undefined;
      users = await queryAPIService.selectFromTable('users');
      expect(users).to.be.an('array');
    });
  });

  describe('People', () => {
    it('Non Existing Table', async () => {
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.getFromDBTable('test');
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('People', () => {
    it('Non Existing Table', async () => {
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.getFromDBTable('test');
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('People', () => {
    it('Non Existing Table', async () => {
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.getFromDBTable('test');
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
    });
  });
});
