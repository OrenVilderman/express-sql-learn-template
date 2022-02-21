# express-sql-learn-template
Demo express server with sql, controllers, routes and services, as a basic demonstration of architecture and how to implement unit testing with high coverage in typescript

## GitHub Repository
[![`GitHub`](https://img.shields.io/github/package-json/v/OrenVilderman/express-sql-learn-template?logo=github)](https://github.com/OrenVilderman/express-sql-learn-template.git)
[![Tests](https://github.com/OrenVilderman/express-sql-learn-template/actions/workflows/test.yml/badge.svg)](https://github.com/OrenVilderman/express-sql-learn-template/actions/workflows/test.yml)

## Installation
Install by running 
``` 
npm install
```

## Start the server with debug* (Optional to use F5 before running the script)
Start the server by running:
``` 
npm start
```
Start with nodemon by running:
``` 
npm run start-dev
```

## Start the jest coverage tests that will print the full Jest HTML coverage report
Start the tests by running:
``` 
npm test
```

# API Design Documentation
`/api/V0.1`
CRUD functionality for all the defult tables in the DB is exposed with the andpoints and also available in the UI.
## GET
`GET /api/V0.1/{query|winner|user}/all`
### Query Parameters
- **non**
### Body
- **non**
### Response
- **JSON** - Array contain all the rows of the table
### Errors
- **404** - Not Found
### Example Request
```typescript
request(app)
	.get('/api/V0.1/query/all');
```
### Example Response
`200 OK`
```typescript
[
	{
        "id": 1,
        "name": "Aapo",
        "uuid": "1c8f884c-7cd7-4ea9-953a-3c79cc4e38c7",
        "dob": "1993-01-01T03:25:10.243Z",
        "email": "aapo.latt@example.com",
        "gender": "male",
        "picture": "https://randomuser.me/api/portraits/men/71.jpg",
        "role": null
    },
	...
```
## POST
`POST /api/V0.1/{query|winner|user}/create`
### Query Parameters
- **non**
### Body
- **non**
### Response
- **JSON** - Array contains the single inserted row to the DB
### Errors
- **500** - Internal Server Error
### Example Request
```typescript
request(app)
	.post('/api/V0.1/winner/create')
```
### Example Response
`201 Created`
```typescript
[
    {
        "id": 6,
        "lucky_number": 87,
        "join_date": "2022-02-12T21:08:23.470Z"
    }
]
```
`POST /api/V0.1/{query|winner|user}/export`
### Query Parameters
- **non**
### Body
- **type** - The format of the exported file (csv, text, json)
- **where** - Query in the format of SQLite
### Response
- **Buffer** - Contian the file data in the requsted format (csv, text, json)
### ErrorsContent-Type
- **500** - Internal Server Error
### Example Request
```typescript
request(app).post('/api/V0.1/user/export')
	.send({
		type: "csv",
		where: "id < 5 AND join_date LIKE '%5%'"
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
```
### Example Response
`200 OK`
```text
id,luck,join_date
1,0,2022-02-12T21:02:36.559Z
2,0,2022-02-12T21:06:15.995Z
4,0,2022-02-12T21:07:05.611Z
```

### UI interface is available in local server at: http://localhost:${PORT}/index.html

## Unit tests cover status:
<img alt="Image_Of_Unit_Tests_Cover_Report" src="public\Unit_Tests_Cover.png" style="min-width:800px; width:1200px;"/>

## Pull Request / Contribute
PRs are only possible from a separate branch.

Before submitting a PR please validate lint, unit tests, test cover and version update:
- You should fix linting issues by running `npm run fix-lint` - Make sure to fix every error and warning.
- You should run unit tests by running `npm test` - Make sure that all the tests pass.
- The test coverage should get to **100%**, now: `99.73% Statements 747/749 | 97.55% Branches 279/286 | 100% Functions 117/117 | 99.67% Lines 606/608` - Make sure to add tests if needed.
- **Always** increment* the version, according to the specifications below.
- Adding a unit test that uncover a bug is very welcome - I will create a fix for the bug that will allow you to pull and merge your unit test ASAP.

*The correct way to increment the version is by using the correct npm script that represent the change you are introducing

## Versions
Run `npm version patch` in cases of bug fixes or small modifications.

Run `npm version minor` in cases of functionality changes with **non-breaking** changes.

Run `npm version major` in cases of important functionality or any **breaking** changes.
