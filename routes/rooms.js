var express = require('express');
var router = express.Router();
var roomList = [];

/* GET rooms */
router.get('/', function(req, res, next) {

  db.all(`SELECT Id from rooms`, [], (err, rows) => 
   {
     if (err) { throw(err); }
     rows.array.forEach(row => {
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
  var body = JSON.parse(req.body.text);
  var roomId = Math.random();

  // insert room into table
  db.run(`INSERT INTO rooms(Id) VALUES(?,?)`, [roomId, 0], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  // close the database connection
  db.close();

})

module.exports = router;
