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
  var userId = Math.floor(Math.random() * 100000000);

  // insert room into table
  db.run(`INSERT INTO room(Id,ownerId,revealed) VALUES (?,?,?)`, [roomId, userId, 0], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Room with id ${roomId} created by user ${userName} with userId ${userId} `);
  });

  // insert admin user
  db.run(`INSERT INTO user(Id,name) VALUES (?,?) ON CONFLICT (Id) DO UPDATE SET name = excluded.name`, [userId, userName], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Admin user ${userName} with Id ${userId} created`);
  });

  // create session for admin user
  db.run(`INSERT INTO session(room_id,user_id,current_vote) VALUES (?,?,?)`, [roomId, userId, 'NULL'], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Session for room ${roomId} and user ${userName} created`);
  });

  res.status(200).json({roomId: roomId , userId : userId });
})

// Join a room 
router.post('/join', function(req, res, next) {
  var userName = req.body.name;
  var roomId = req.body.roomId;

  var userId =  Math.floor(Math.random() * 100000000); 

  // insert user
  db.run(`INSERT INTO user(Id,name) VALUES (?,?) ON CONFLICT (Id) DO UPDATE SET name = excluded.name`, [userId, userName], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`User ${userName} with Id ${userId} created`);
  });
  
  // create session for user
  db.run(`INSERT INTO session(room_id,user_id,current_vote) VALUES (?,?,?)`, [roomId, userId, 'NULL'], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Session for room ${roomId} and user ${userName} created`);
  });
  res.status(200).json({userId : userId });
});


//async function getRoomOwnerAsync(db,roomId){
//  db.get(`SELECT ownerId from room WHERE Id = (?)`, [roomId], (err, row) => 
//   {
//     if (err) { throw(err); }
//     resolve(row);
//   });    
// }

// function getRoomOwner(db,roomId) {
//   return await getRoomOwnerAsync(db,roomId);
// }

// Reveal votes in a room
router.post('/reveal', function(req, res, next) {
  // Check if user is admin
  // var ownerId = getRoomOwner(db, req.body.roomId);
  // if (!ownerId || ownerId != req.session.userId){
  //   res.status(500);
  //   return;
  // };  
  // Set room to revealed
  db.run(`UPDATE room SET revealed = 1 WHERE roomId = (?)`, [req.body.roomId], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Room ${req.body.roomId} revealed`);
  });  
  res.send('Ok');
});

// Reset all votes back
router.post('/reset', function(req, res, next) {
  db.run(`UPDATE room SET revealed = 0 WHERE roomId = (?)`, [req.body.roomId], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Room ${req.body.roomId} is not revealed`);
  });  
  db.run(`UPDATE session SET current_vote = 0 WHERE roomId = (?)`, [req.body.roomId], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`Votes are reset for room number ${req.body.roomId}`);
  });  
  res.send('Ok');
});

// Voting
router.post('/vote', function(req, res, next) {
  db.run(`UPDATE session SET current_vote = (?) WHERE roomId = (?) AND userId = (?)`, [req.body.vote, req.body.roomId, req.body.userId], function(err) {
    if (err) {return console.log(err.message);}
    console.log(`User ${req.body.userId} voted in room ${req.body.roomId} with ${req.body.vote}`);
  });  
  res.send('Ok');
});

module.exports = router;
