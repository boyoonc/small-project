var express = require('express')
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')
var path = require('path')
var Sequelize = require('sequelize')
var fs = require('fs')

// db part

var db = new Sequelize('postgres://localhost:5432/things_db',{logging:false})
var Things = db.define('things', {
	name: {
		type: Sequelize.STRING
	}
})

function seed(){
	return Promise.all([Things.create({name: 'seeding'}), Things.create({name: 
		'for the first time!'})])
}


// express part
var app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set('view engine', 'html')
app.engine('html', nunjucks.render)
nunjucks.configure('views', {noCache: true})

//now that i think about this, i wont use nunjucks to maybe i dont need this

// app.use('/vendor', express.static(path.join(__dirname, 'node_modules'))) //what is this normally for
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')))
//can go to here http://localhost:3000/jquery/jquery.min.js


app.get('/', function(req, res, next){
	// Things.findAll()
	// .then(function(allThings){
	// 	// console.log(allThings)
	// 	// res.send(allThings)
	// 	res.render('index.html', {data:allThings})

	// })
	res.render('index.html', {data:'hello?'})
	
})

app.post('/send', function(req, res, next){
	Things.create({name: req.body['for-reals']})
	.then(function(made){
		Things.findAll()
	.then(function(allThings){
		// console.log(allThings)
		res.send(allThings)
		// res.render('index.html', {data:allThings})

	})	
	})
	
	// res.redirect('/')
})

//putting things together
db.sync({force:true})
	.then(function(){
		seed()
	})
	.then(function(){
		app.listen(3000, function(){
		console.log('listening')
		})		
	})
