
// create database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// create database tables

// create room table
db.run('CREATE TABLE room(Id integer, ownerId integer , revealed integer, PRIMARY KEY (Id))');

// create user table
db.run('CREATE TABLE user(Id integer, name text , PRIMARY KEY (Id))');

// create sessions table
db.run('CREATE TABLE session(room_id integer, user_id integer , current_vote integer, PRIMARY KEY (room_id , user_id))');

module.exports = db