var express = require('express');
var router = express.Router();
var db = require("../database.js")

/* GET rooms */
router.get('/', function(req, res, next) {
    db.all(`SELECT Id from room`, [], (err, rows) => 
   {
     if (err) { throw(err); }
     res.status(200).json(rows);
   });
});

/* GET single room */
router.get('/:roomId', function(req, res, next) {
  res.send(req.params.roomId);
});

// Create a room
router.post('/', function (req, res) {
  console.log(req.body);
  var userName = req.body.name;
  var roomId = Math.floor(Math.random() * 100000000);
  
  var userId;
  if (!req.session.userId) { req.session.userId = Math.floor(Math.random() * 100000000); }
  userId = req.session.userId;

  // insert room into table
  db.run(`INSERT INTO room(Id,ownerId,revealed) VALUES (?,?,?)`, [roomId, userId, 0], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Room with id ${roomId} created by user ${userName} with userId ${userId} `);
  });

  // insert admin user
  db.run(`INSERT INTO user(Id,name) VALUES (?,?)`, [userId, userName], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Admin user ${userName} with Id ${userId} created`);
  });

  // create session for admin user
  db.run(`INSERT INTO session(room_id,user_id,current_vote) VALUES (?,?,?)`, [roomId, userId, 'NULL'], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Session for room ${roomId} and user ${userName} created`);
  });

  res.send('Ok');
})

// Join a room 
router.post('/join', function(req, res, next) {
  var userName = req.body.name;
  var roomId = req.body.roomId;

  var userId;
  if (!req.session.userId) { req.session.userId = Math.floor(Math.random() * 100000000); }
  userId = req.session.userId;

  // insert user
  db.run(`INSERT INTO user(Id,name) VALUES (?,?) ON CONFLICT (Id) DO UPDATE SET name = (?)`, [userId, userName], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`User ${userName} with Id ${userId} created`);
  });
  
  // create session for user
  db.run(`INSERT INTO session(room_id,user_id,current_vote) VALUES (?,?,?)`, [roomId, userId, 'NULL'], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Session for room ${roomId} and user ${userName} created`);
  });
});

module.exports = router;
