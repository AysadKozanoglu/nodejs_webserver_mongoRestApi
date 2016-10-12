//process.env.NODE_ENV = 'production';

var log = require('simple-node-logger').createSimpleLogger('log-httpApirest.log');
log.setLevel('info');
var colors = require('colors');
var express = require('express');
var app = express();
var nodeUuid = require('node-uuid');
var port = 8084;
var queryLimit =20;
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;

var mode = process.env;

// print process.argv
//process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});

var args = process.argv.slice(2);
//console.log(args[0]);
if (args[0])
	port = args[0];

function logger(txt){
//  console.log(txt);
    log.info(txt);
}

logger(mode.NODE_ENV);

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/testdb", function(err, database) {
  if(err) throw err;

  db = database;
  // Start the application after the database connection is ready
  app.listen(port);
  logger("Listening on port "+port);
});

app.get('/', function (req, res) {

    logger( Date.now());
  //  res.end( Date.now());

})

app.get('/cihazlar', function(req, res) {
	res.set({ 'content-type': 'application/json; charset=utf-8' });
    var collection = db.collection('users');
    collection.distinct('device', function(err, docs) {
        res.json(docs);
//		db.close();
    });
})

app.get('/goster/say', function(req, res) {
	res.set({ 'content-type': 'application/json; charset=utf-8' });
    var collection = db.collection('users');
    collection.count().then(function(count) {
        res.json(count);
//		db.close();
    });
})

function logger(txt){
//	console.log(txt);
	log.info(txt);
}

app.get('/goster/:device', function (req, res) {
	//  http://...goster/htc
	res.set({ 'content-type': 'application/json; charset=utf-8' });
	var dev = req.params.device || "htc";
    var collection = db.collection('users');
    collection.find({"device":dev}).limit(queryLimit).sort({_id:-1}).toArray(function(err, 
docs){
        res.send(docs);
//		db.close();
    });
	logger(dev);
})


var lati,long,dev,uuid;
app.get('/api/:long/:lati/:device/:uuid/:adress', function(req, res) {

    lati = req.params.lati;
    long = req.params.long;
    dev = req.params.device;
    uuid = req.params.uuid;
	adress = req.params.adress;
    device = req.params.device;
    res.set({ 'content-type': 'application/json; charset=utf-8' });

	if(lati && long && dev && uuid){
		var collection = db.collection('users');
		var toInsert = {
						'long':long,'lat':lati,'device':dev,'uuid':uuid,
						'NodeID':nodeUuid.v4(),'adress':adress
						};
		collection.insert(toInsert, {w:1}).then(function(count) {
			res.json({"status":"true"})
//			db.close();
		});
		toLog = long +" "+ lati +" "+uuid+" "+colors.yellow(dev)+" "+adress;
		logger(toLog);
	}
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
