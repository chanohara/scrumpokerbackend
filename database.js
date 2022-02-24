
// create database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// create database tables
db.run('CREATE TABLE room(Id integer, ownerId integer , PRIMARY KEY (Id))');
module.exports = db