import express from 'express';
import { expect } from 'chai';
import {
  describe, it, afterAll,
} from '@jest/globals';
import indexRouter from '../routes/index';
import { PeopleAPIService, QueryAPIService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Services Tests Suite', () => {
  afterAll(async () => {
    /**
     * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
     */
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

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
       * When tests run on ubentu, files have diffrent limitations
       */
      if (nonExistingTable.includes('runner')) {
        expect(nonExistingTable).to.include('/db/tmp/out.text');
      } else {
        expect(nonExistingTable).to.include('\\db\\tmp\\out.text');
      }
    });

    it('Export No Such File Error', async () => {
      const peopleAPIService = new PeopleAPIService();
      const nonExistingFile = await peopleAPIService.exportPeopleData('people', 'name LIKE \'%%\'', '|' as any);
      /**
       * When tests run on ubentu, files have diffrent limitations
       */
      if (nonExistingFile.includes('runner')) {
        expect(nonExistingFile).to.include('/db/tmp/out.|');
      } else {
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
