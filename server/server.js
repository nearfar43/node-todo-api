//js library
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

//local file
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User2} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

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

//route handling get by id 
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Id is invalid');
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send()); 

});

//route handling delete by id
app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Id is invalid');
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	}).catch((e) => res.status(400).send());
});

app.listen(port, () => {
	console.log(`Started on at Port ${port}`);
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