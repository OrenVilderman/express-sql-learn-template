# express-sql-learn-template

## Installation
Install by running 
``` 
npm install
```

## Start Server with debug* (Optional to use F5 before running the script)
Start with nodemon by running:
``` 
npm start
```
Start directly with ts-node by running:
``` 
npm run start-backup
```

## Start the tests that will print the full Jest HTML coverage report
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
<img alt="Image_Of_Unit_Tests_Cover_Report" src="public\Unit_Tests_Cover.png" style="width:95%;"/>

## TODO:
### # Create unit tests in precompile script to be later use in git merge
### # Create compile and lint tests by using GitHub Actions 
### # Improve the public UI+UX
### ~~Push to GitHub the public interface~~ Done
### ~~Add PATCH API calls from the public UI~~ Done
### ~~Add endpoint documentation in README to be used in Postman~~ Done
### ~~Publish the file export methods that support CSV,JSON and TEXT export format for DB tables~~ Done
### # Think if to allow SQL Injections via the UI
### # Publish site to domain
### # Decide version 1.0.0
### # Add UI library for components