'use strict'

var isUrl = require('is-url')
var shortid = require('shortid')
var appUrl = "http://www.tosp.net.au:3001/"

module.exports = (app, collection) => {

	app.route('/')
		.get( (req, res) => {
			res.sendFile(process.cwd() + '/public/index.html')
		}
	)

	app.route('/new/*')
		.get( (req, res) => {
			var originalUrl = req.url.replace('/new/', '')
			if (!isUrl(originalUrl)) {
				return res.json({error: 'Invalid URL'})
			}
			let url = {
				original_url: originalUrl,
				short_url: shortid.generate()
			}
			collection.insert(url, (err, data) => {
				if (err) return res.status(500).send(err)
				res.json({
					original_url: url.original_url,
					short_url: appUrl + url.short_url
				})
			})
	})

	app.route('/*')
		.get( (req, res) => {
			collection.findOne(
				{short_url: req.url.slice(1)},
				(err, url) => {
					if (err) return res.status(500).send(err)
					if (url) {
						res.redirect(url.original_url)
					} else {
						res.json({error: "Invalid short URL"})
					}
				}
			)
	})
}
