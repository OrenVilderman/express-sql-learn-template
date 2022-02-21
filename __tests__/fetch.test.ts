import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import { describe, it, afterAll } from '@jest/globals';
import indexRouter from '../routes/index';
import { GeneralService } from '../services/index';

const app = express();
app.use(express.json());
app.use('/api/V0.1', indexRouter);

describe('Fetch Tests Suite', () => {
  afterAll(async () => {
    /**
     * Allow logs after tests are done to finish with exit code 0 on GitHub Actions
     */
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  it('Validate Get Person Picture', async () => {
    const peopleGetBefore = await request(app).post('/api/V0.1/query/create');
    expect(peopleGetBefore.status).to.equal(201);
    expect(peopleGetBefore.body[0]).to.be.an('object').that.is.not.null;
    expect(peopleGetBefore.type).to.equal('application/json');
    const generalService = new GeneralService();
    const userImage = await generalService.fetchStatus(peopleGetBefore.body[0].picture);
    expect(userImage.Status).to.equal(200);
    expect(userImage.Body.Type).to.equal('image/base64');
  });

  it('Validate Post Method', async () => {
    const generalService = new GeneralService();
    const postResponse = await generalService.fetchStatus('https://www.w3schools.com/test/demo_form.php HTTP/1.1', { method: 'POST', body: '' });
    expect(postResponse.Status).to.equal(404);
    expect(postResponse.Body.Type).to.equal('xml');
  });

  it('Validate Get And Parse HTML', async () => {
    const generalService = new GeneralService();
    const userImage = await generalService.fetchStatus('https://www.w3schools.com/lib/w3schools30.css');
    expect(userImage.Status).to.equal(200);
    expect(userImage.Body.Type).to.equal('html');
  });

  it('Validate Get Error', async () => {
    const generalService = new GeneralService();
    const errorResponse = await generalService.fetchStatus('https://www.w3schools.com/xml/note.xml');
    expect(errorResponse.Status).to.equal(200);
    expect(errorResponse.Body.Type).to.equal('Error');
  });

  it('Validate Fetch Error', async () => {
    const generalService = new GeneralService();
    const fetchError = await generalService.fetchStatus('https://www.google.com.index');
    expect(fetchError.Status).to.be.undefined;
    expect(fetchError.Body.Type).to.equal('system');
    expect(fetchError.Body.Name).to.equal('FetchError');
  });
});
