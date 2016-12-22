var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()
mongoose.connect('mongodb://localhost:27017/movie_demo')
app.set('views', './views/pages')
app.set('view engine', 'jade')
	//app.use(express.bodyParser())
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
	//app.use(express.static(path.join(_dirname, 'bower_components')))
app.locals.moment = require('moment')
var serveStatic = require('serve-static')
app.use(serveStatic('bower_components'))
app.listen(port)
console.log('imooc started on port' + port)


//主页
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		})
	})
})

//详情
app.get('/movie/:id', function(req, res) {
		var id = req.params.id
		Movie.findById(id, function(err, movie) {
			res.render('detail', {
				title: 'imooc ' + movie.title,
				movie: movie
			})


		})

	})
	//后台
app.get('/admin/movie', function(req, res) {
		res.render('admin', {
			title: 'imooc 后台录入页',
			movie: {
				title: '',
				doctor: '',
				country: '',
				year: '',
				poster: '',
				flash: '',
				summary: '',
				language: ''
			}
		})

	})
	//admin update movie
app.get('/admin/update/:id', function(req, res) {
		var id = req.params.id
		if (id) {
			Movie.findById(id, function(err, movie) {
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie
				})
			})
		}
	})
	//admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash


		})
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies



		})
	})

})