//js library
var express = require('express');
var bodyParser = require('body-parser');

//local file
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User2} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res, next) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res, next) => {
	Todo.find().then((todos) => {
		res.send({todos}); 
	}, (e) => {
		res.status(400).send(e);
	});
});

app.listen(3000, () => {
	console.log('Started on Port 3000');
});


module.exports = {app : app};





// var newUser = new User2({
// 	name: 'Jeffrey',
// 	email: 'jeffrey@com.tw'
// });

// newUser.save().then((doc) => {
// 	console.log('Save user2', doc);
// }, (e) => {
// 	console.log('Unable to save user2', e);
// });


// //new instance
// var newTodo = new Todo({
// 	text: 'Feed the cat',
// 	completed: true,
// 	completedAt: 123
// });

// //save instance into mongodb
// newTodo.save().then((doc) => {
// 	console.log('Save todo', doc);
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save todo', e);
// });