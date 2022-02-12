import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from './index';

const fetch = require('node-fetch');
const { CronJob } = require('cron');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

export let webSocket: WebSocket;

export declare type exportFormat =
  | 'csv'
  | 'text'
  | 'json'

/**
 * ConsoleColors are used in this demo instead the use of logger types: log/debug/error
 * This is to make the the project easier to display
 */
export const ConsoleColors = {
  SystemInformation: 'color: #F87217',
  Information: 'color: #FFD801',
  AssertionStatusLog: 'color: #893BFF',
  FetchStatus: 'color: #893BFF',
  IncomingRequest: 'color: #3BB9FF',
  SqlQuery: 'color: #6AFB92',
  Error: 'color: #FF0000',
  Success: 'color: #00FF00',
};

export interface FetchStatusResponse {
  Ok: boolean;
  Status: number;
  Headers?: any;
  Body: any;
  Error: any;
}

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchRequestInit {
  method?: HttpMethod;
  body?: string;
  headers?: {
    [key: string]: string;
  };
  timeout?: number;
  size?: number;
}

export class GeneralService {
  /**
   * This method is used for all the fetch API calls
   * This method will add informative logs and will also provide the type of non parseable responses in many common cases
   * @param url
   * @param requestInit
   * @returns
   */
  fetchStatus(url: string, requestInit?: FetchRequestInit): Promise<FetchStatusResponse> {
    const start = performance.now();
    let responseStr: string;
    let parsed: any = {};
    let errorMessage: any = {};
    return fetch(url, {
      method: `${requestInit?.method ? requestInit?.method : 'GET'}`,
      body: typeof requestInit?.body === 'string' ? requestInit.body : JSON.stringify(requestInit?.body),
      headers: {
        ...requestInit?.headers,
      },
      timeout: requestInit?.timeout,
      size: requestInit?.size,
    })
      .then(async (response: any) => {
        const end = performance.now();
        const isSucsess = !!(response.status > 199 && response.status < 400);
        console[isSucsess ? 'log' : 'error'](
          `%cFetch ${isSucsess ? '' : 'Error '}${requestInit?.method ? requestInit?.method : 'GET'}: ${url
          } took ${(end - start).toFixed(2)} milliseconds`,
          `${isSucsess ? ConsoleColors.FetchStatus : ConsoleColors.Information}`,
        );
        try {
          if (response.headers.get('content-type')?.startsWith('image')) {
            responseStr = await response.buffer().then((r: any) => r.toString('base64'));
            parsed = {
              Type: 'image/base64',
              Text: responseStr,
            };
          } else {
            responseStr = await response.text();
            parsed = responseStr ? JSON.parse(responseStr) : '';
          }
        } catch (error) {
          if (responseStr && responseStr.substring(20).includes('xml')) {
            parsed = {
              Type: 'xml',
              Text: responseStr,
            };
            errorMessage = error;
          } else if (responseStr && responseStr.substring(20).includes('html')) {
            parsed = {
              Type: 'html',
              Text: responseStr,
            };
            errorMessage = error;
          } else {
            parsed = {
              Type: 'Error',
              Text: responseStr,
            };
            errorMessage = error;
          }
        }

        const headersArr: any = {};
        response.headers.forEach((value: any, key: string | number) => {
          headersArr[key] = value;
        });

        return {
          Ok: response.ok,
          Status: response.status,
          Headers: headersArr,
          Body: parsed,
          Error: errorMessage,
        };
      })
      .catch((error: { type: any; name: any; message: any; }) => {
        console.error(`Error type: ${error.type}, ${error}`);
        return {
          Ok: undefined as any,
          Status: undefined as any,
          Headers: undefined as any,
          Body: {
            Type: error.type,
            Name: error.name,
          },
          Error: error.message,
        };
      });
  }

  convertJsonToCsv = (json: any) => {
    const headers = [];
    for (const key in json[0]) {
      headers.push({ id: key, title: key });
    }

    const csvStringifier = createCsvStringifier({ header: headers });

    const headLine = csvStringifier.getHeaderString();
    const dataRows = csvStringifier.stringifyRecords(json);
    return `${headLine}${dataRows}`;
  };

  exportDataAsFile = async (data: any, type: exportFormat) => {
    let dataToExport;
    switch (type) {
      case 'csv':
        dataToExport = this.convertJsonToCsv(data);
        break;
      case 'json':
      case 'text':
        dataToExport = JSON.stringify(data);
        break;
      default:
        dataToExport = JSON.stringify(data);
        break;
    }
    fs.writeFileSync(path.resolve(process.cwd(), `./db/tmp/out.${type}`), dataToExport);
    return path.resolve(process.cwd(), `./db/tmp/out.${type}`);
  };

  /**
   * This chron job will run every interval you set and add people from the random people generator API
   * @param intervalTime
   */
  initiateNewPeopleCronJob(intervalTime: number) {
    console.log(`%cCron Job Execution Set To Start Every: ${intervalTime} Minutes`, ConsoleColors.SystemInformation);
    return new CronJob(`1 */${intervalTime} * * * *`, (async (): Promise<void> => {
      console.log('%cCron Job Execution Started', ConsoleColors.SystemInformation);
      let newPerson: any = await this.fetchStatus(process.env.USER_API || 'https://randomuser.me/api', { method: 'GET' });
      newPerson = newPerson.Body.results[0];
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();
      await queryAPIService.addOrCreateDBTableFromData([{
        uuid: uuid(),
        name: newPerson.name.first,
        gender: newPerson.gender,
        dob: newPerson.dob.date,
        picture: newPerson.picture.large,
        email: newPerson.email,
      }]);

      if (webSocket === undefined || webSocket.readyState == 3) {
        let fetchResponse;
        try {
          fetchResponse = await this.fetchStatus(process.env.WEBSOCKET_URL || 'websocket-echo.com', { method: 'GET' });
          const socketMessage = await fetchResponse.Body.Text;
          if (socketMessage == 'Upgrade Required') {
            webSocket = this.initiateWebSocket();
            /**
             * Free the event loop to change WebSocket readyState after initiation (2 seconds is safe spot for this API from testing)
             */
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
          if (webSocket.readyState == 1) {
            webSocket.send('New Person Added To DB By Cron Job Execution');
          } else {
            console.log('%cError in connection to websocket', ConsoleColors.Error);
          }
        } catch (error) {
          console.log(`%cFetch Error GET: ${process.env.WEBSOCKET || 'websocket-echo.com'}`, ConsoleColors.Error);
        }
      } else {
        webSocket.send('New Person Added To DB By Cron Job Execution');
      }
    }));
  }

  initiateWebSocket = () => {
    webSocket = new WebSocket(`ws://${process.env.WEBSOCKET || 'websocket-echo.com'}`);

    webSocket.on('open', () => {
      console.log('%cConnected To WebSocket', ConsoleColors.Information);
    });

    webSocket.on('close', () => {
      console.log('%cDisconnected From WebSocket', ConsoleColors.Information);
    });

    // TODO: In cases where another websocket is used - please change this function to do what is needed
    /**
     * Logger for the responses when using the default websocket: websocket-echo.com
     */
    webSocket.on('message', (data: string) => {
      console.log(`%cThis message is eco from websocket-echo.com: ${data}`, ConsoleColors.Information);
    });

    return webSocket;
  };
}
