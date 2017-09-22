'use strict'

var express = require('express')
var mongo = require('mongodb').MongoClient

require('dotenv').load()
let uri = process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener'
var app = express()
var routes = require('./app/routes/index.js')

mongo.connect(uri, (err, db) => {
	if (err) throw err

	routes(app, db.collection('urls'))

	let port = process.env.PORT || 3001
	app.listen(port, () => {
		console.log(console.log('Node.js listening on port ' + port + '...'))
	})
})
