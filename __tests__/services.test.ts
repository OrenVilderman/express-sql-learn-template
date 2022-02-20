import express from 'express';
import { expect } from 'chai';
import {
  describe, it,
} from '@jest/globals';
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

    it('Drop And Create Defult Table People', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      let people;
      let noSuchTableDBMessage;
      expect(people).to.be.undefined;
      people = await queryAPIService.selectFromTable('people');
      expect(people).to.be.an('array');
      await queryAPIService.dropTableByName('people');
      try {
        people = await queryAPIService.selectFromTable('people');
      } catch (error) {
        if (error instanceof Error) {
          noSuchTableDBMessage = error.message;
        }
      }
      expect(noSuchTableDBMessage).to.equal('Error: SQLITE_ERROR: no such table: people');
      await queryAPIService.createDefultDBTablesIfMissing();
      people = undefined;
      expect(people).to.be.undefined;
      people = await queryAPIService.selectFromTable('people');
      expect(people).to.be.an('array');
    });

    it('Drop And Create Defult Table Winners', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      let winners;
      let noSuchTableDBMessage;
      expect(winners).to.be.undefined;
      winners = await queryAPIService.selectFromTable('winners');
      expect(winners).to.be.an('array');
      await queryAPIService.dropTableByName('winners');
      try {
        winners = await queryAPIService.selectFromTable('winners');
      } catch (error) {
        if (error instanceof Error) {
          noSuchTableDBMessage = error.message;
        }
      }
      expect(noSuchTableDBMessage).to.equal('Error: SQLITE_ERROR: no such table: winners');
      await queryAPIService.createDefultDBTablesIfMissing();
      winners = undefined;
      expect(winners).to.be.undefined;
      winners = await queryAPIService.selectFromTable('winners');
      expect(winners).to.be.an('array');
    });

    it('Drop And Create Defult Table Users', async () => {
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

    it('Get From Dropped Table Error By Name', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      await queryAPIService.dropTableByName('people');
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.getFromPeopleByName('testName');
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
      await queryAPIService.createDefultDBTablesIfMissing();
    });

    it('Create From No Connection Error', async () => {
      process.env.USER_API = 'dummy.not.a.site.comb';
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.createNewPerson();
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
      delete process.env.USER_API;
    });

    it('Export From Table With Like', async () => {
      const peopleAPIService = new PeopleAPIService();
      await peopleAPIService.createNewPerson();
      await peopleAPIService.createNewPerson();
      await peopleAPIService.createNewPerson();
      const nonExistingTable = await peopleAPIService.exportPeopleData('people', 'name LIKE \'%%\'', 'text');
      /**
       * This validation of the error message will not be possible in the github actions VM
       */
      if (nonExistingTable) {
        expect(nonExistingTable).to.include('\\db\\tmp\\out.text');
      }
    });

    it('Export No Such File Error', async () => {
      const peopleAPIService = new PeopleAPIService();
      const nonExistingFile = await peopleAPIService.exportPeopleData('people', 'name LIKE \'%%\'', '|' as any);
      /**
       * This validation of the error message will not be possible in the github actions VM
       */
      if (nonExistingFile) {
        expect(nonExistingFile).to.include('NOENT: no such file or directory');
      }
    });

    it('Update From Dropped Table Error', async () => {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      await queryAPIService.dropTableByName('people');
      const peopleAPIService = new PeopleAPIService();
      const nonExistingTable = await peopleAPIService.updatePerson('testName', {});
      expect(nonExistingTable).to.be.an('array').with.lengthOf(0);
      await queryAPIService.createDefultDBTablesIfMissing();
    });
  });
});
