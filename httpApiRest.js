//
// Author: Aysad Kozanoglu
// email: aysadx@gmail.com
// web: http://aysad.pe.hu
// use the syslog_json_piper.sh as connector to log management

//process.env.NODE_ENV = 'production';

var log 	      = require('simple-node-logger').createSimpleLogger('log-httpApirest.log');
var base64      = require('js-base64').Base64;
var colors 	    = require('colors');
var express     = require('express');
var sleepms 	  = require('sleep-ms');
var app 	      = express();
var nodeUuid 	  = require('node-uuid');
var port 	      = 8084;
var queryLimit 	= 20;
var mongodb 	  = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectID;
var dbname 	    = "logs";
var mode 	      = process.env;

log.setLevel('info');

// print process.argv
//process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});
var args = process.argv.slice(2);

//console.log(args[0]);
if (args[0])
	port = args[0];

if (args[1])
	database= args[1];

function logger(txt){
//  console.log(txt);
    log.info(txt);
}

logger(mode.NODE_ENV);

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/"+dbname, function(err, database) {
  if(err) throw err;

  db = database;
  // Start the application after the database connection is ready
  app.listen(port);
  logger("Listening on port "+port+" db:"+dbname );
});

app.get('/', function (req, res) {

    logger( Date.now());
  //  res.end( Date.now());

})

app.get('/get', function(req, res) {
	res.set({ 'content-type': 'application/json; charset=utf-8' });
    var collection = db.collection('hosts');
    	// collection.distinct('host', function(err, docs) {
	collection.find({}).limit(queryLimit).sort({_id:-1}).toArray(function(err, docs) {
        res.json(docs);
//		db.close();
    });
})


app.get('/getid/:id', function (req, res) {
  id = req.params.id;
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  var collection = db.collection('hosts');
      // collection.distinct('host', function(err, docs)
    collection.findOne({"_id": new ObjectId(id)}, function(err, docs) {
        res.json(docs);
//    db.close();
    });  
})


app.get('/count', function(req, res) {
	res.set({ 'content-type': 'application/json; charset=utf-8' });
    var collection = db.collection('hosts');
    collection.count().then(function(count) {
        res.json(count);
//		db.close();
    });
})

function logger(txt){
//	console.log(txt);
	log.info(txt);
}

app.get('/get/:searchStr', function (req, res) {
	searchStr = req.params.searchStr;
	res.set({ 'content-type': 'application/json; charset=utf-8' });
    	var collection = db.collection('hosts');
//    collection.find( { "host" : { $regex : searchStr } }).limit(queryLimit).sort({_id:-1}).toArray(function(err, docs){
//       res.send(docs);
//		db.close();
//    });

collection.find( { $text : {$search : searchStr}  } , 
                {score : { $meta: "textScore" } })
                .sort( { score: { $meta: "textScore" } } )
                .toArray(function(err, docs){
                    res.send(docs);
                //    db.close();
                });
	logger(searchStr);
})


var jsonValue;
var toInsert;
app.get('/add/:Value', function(req, res) {

    jsonValue 	= base64.decode(req.params.Value);
    jsonValue 	= JSON.parse(jsonValue); 
    uuid 	= req.params.uuid;
    host 	= jsonValue.host;
    message	= jsonValue.mess;
    timestamp	= Date.now();
    date	= jsonValue.date;

    res.set({ 'content-type': 'application/json; charset=utf-8' });

	if(jsonValue){
		var collection = db.collection('hosts');
		var toInsert = {'host':host,'date':date,'dbtimestamp':timestamp,'message':message};
		//var toInsert = jsonValue;
		collection.insert(toInsert, {w:1}).then(function(count) {
			res.json({"status":"true"})
//			db.close();
		});
		toLog = colors.yellow(jsonValue.host);
		logger(toLog);
	}
sleepms(300);
})


//
//var server = app.listen(port, function () {
//
//   var host = server.address().address
//   var port = server.address().port
//
//   console.log("listening at http://%s:%s", host, port)
//
//})
