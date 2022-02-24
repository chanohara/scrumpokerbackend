var express = require('express');
var router = express.Router();
var db = require("../database.js")
var roomList = [];

/* GET rooms */
router.get('/', function(req, res, next) {
    db.all(`SELECT Id from room`, [], (err, rows) => 
   {
     if (err) { throw(err); }
     rows.forEach(row => {
       roomList.push( row );
     });
   });

  res.send(JSON.stringify(roomList));
});

/* GET single room */
router.get('/:roomId', function(req, res, next) {
  res.send(req.params.roomId);
});

router.post('/', function (req, res) {
  console.log(req.body);
  var body = JSON.parse('{}');
  var roomId = Math.floor(Math.random() * 100000000);

  // insert room into table
  db.run(`INSERT INTO room(Id,ownerId) VALUES (?,?)`, [roomId, 0], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  res.send('Ok');
})

module.exports = router;
