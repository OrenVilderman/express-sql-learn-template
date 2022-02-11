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

## Start Server with debug* (Optional to use F5 before running the script)
Start the tests by running:
``` 
npm test
```

### UI interface is now available in local server at: http://localhost:${PORT}/index.html

## Unit tests cover status:
### Controllers 60%
### DB* 100%
### Routes 100%   
### Services 70%
##### * - DB include crush test that the server can't recover from, these tests are safe to run but the test file "db.crush.test.ts" better not modified <br />
## TODO:
### # Create unit tests in precompile script to be later use in git merge
### # Create compile and lint tests by using GitHub Actions 
### # Improve the public UI+UX
### ~~Push to GitHub the public interface~~ Done
### ~~Add PATCH API calls from the public UI~~ Done
### # Add endpoint documentation in README to be used in Postman
### # Publish the file export methods that support CSV,JSON and TEXT export format for DB tables
### # Think if to allow SQL Injections via the UI
### # Publish site to domain
### # Decide version 1.0.0
### # Add UI library for components