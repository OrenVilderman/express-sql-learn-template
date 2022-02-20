import { expect } from 'chai';
import { jest, describe, it } from '@jest/globals';
import { GeneralService } from '../services';
import { webSocket } from '../services/general.service';

describe('Cron Tests Suite', () => {
  jest.setTimeout(1000 * 60 * 3);
  it('Validate Web Socket Trigger After Cron Activation', async () => {
    const generalService = new GeneralService();
    const job = generalService.initiateNewPeopleCronJob(1, 20);
    job.start();
    generalService.initiateWebSocket();
    let isEcoTrigger = false;
    webSocket.on('message', (data: string) => {
      if (data == 'New Person Added To DB By Cron Job Execution') {
        isEcoTrigger = true;
      }
      webSocket.close();
    });

    let counter = 0;
    const setIntervalEvery = 4000;
    const cronJobExecutionTestResult = await new Promise((resolve) => {
      const waitForCronInterval: any = setInterval(() => {
        if (isEcoTrigger) {
          clearInterval(waitForCronInterval);
          return resolve('Confirm Interval Trigger');
        }
        counter++;
        if (counter === 30) {
          clearInterval(waitForCronInterval);
          return resolve(`Error: After ${(counter * setIntervalEvery) / 1000} seconds, Web Socket Did Not Trigger`);
        }
      }, setIntervalEvery);
    });
    job.stop();
    expect(cronJobExecutionTestResult).to.equal('Confirm Interval Trigger');
  });

  it('Validate Web Socket Restore And Trigger After Cron Activation', async () => {
    const generalService = new GeneralService();
    const job = generalService.initiateNewPeopleCronJob(1, 20);
    job.start();
    let isEcoTrigger = false;
    let counter = 0;
    const setIntervalEvery = 4000;
    const cronJobExecutionTestResult = await new Promise((resolve) => {
      const waitForCronInterval: any = setInterval(() => {
        webSocket.on('message', (data: string) => {
          if (data == 'New Person Added To DB By Cron Job Execution') {
            isEcoTrigger = true;
          }
          webSocket.close();
        });
        if (isEcoTrigger) {
          clearInterval(waitForCronInterval);
          return resolve('Confirm Interval Trigger');
        }
        counter++;
        if (counter === 30) {
          clearInterval(waitForCronInterval);
          return resolve(`Error: After ${(counter * setIntervalEvery) / 1000} seconds, Web Socket Did Not Trigger`);
        }
      }, setIntervalEvery);
    });
    job.stop();
    expect(cronJobExecutionTestResult).to.equal('Confirm Interval Trigger');
  });
});
