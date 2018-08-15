require('./config/config.js');

//js library
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const lodash = require('lodash');

//local file
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res, next) => {

	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	try {
		const doc = await todo.save();
		res.send(doc);
	}
	catch (e) {
		res.status(400).send(e);
	}
	// todo.save().then((doc) => {
	// 	res.send(doc);
	// }, (e) => {
	// 	res.status(400).send(e);
	// });
});

app.get('/todos', authenticate, async (req, res, next) => {
	
	try {
		const todos = await Todo.find({
			_creator: req.user._id
		});
		res.send({todos});
	}
	catch (e) {
		res.status(400).send(e);
	}

	// Todo.find({
	// 	_creator: req.user._id
	// }).then((todos) => {
	// 	res.send({todos}); 
	// }, (e) => {
	// 	res.status(400).send(e);
	// });
});

//route handling get by id 
app.get('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Id is invalid');
	}

	try {
		const todo = await Todo.findOne({
			_id: id,
			_creator: req.user._id
		});

		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}
	catch (e) {
		res.status(400).send()
	}

	// Todo.findOne({
	// 	_id: id,
	// 	_creator: req.user._id
	// }).then((todo) => {
	// 	if (!todo) {
	// 		return res.status(404).send();
	// 	}
	// 	res.send({todo});
	// }).catch((e) => res.status(400).send()); 

});


//route handling delete by id
app.delete('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Id is invalid');
	}

	try {
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		});

		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}
	catch (e) {
		res.status(400).send();
	}


	// Todo.findOneAndRemove({
	// 	_id: id,
	// 	_creator: req.user._id
	// }).then((todo) => {
	// 	if (!todo) {
	// 		return res.status(404).send();
	// 	}
	// 	res.send({todo});
	// }).catch((e) => res.status(400).send());
});

//route handling patch

app.patch('/todos/:id', authenticate, async (req, res) => {
	var id = req.params.id;

	var body = lodash.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (lodash.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	try {
		const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}
	catch (e) {
		res.status(400).send();
	}

	// Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
		
	// 	if(!todo) {
	// 		return res.status(404).send();
	// 	}

	// 	res.send({todo});

	// }).catch((e) => {
	// 	res.status(400).send();
	// });

});


//POST /users

app.post('/users', async (req, res) => {
	try {
		const body = lodash.pick(req.body, ['email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	}
	catch (e) {
		res.status(400).send(e);
	}

	// user.save().then(() => {
	// 	return user.generateAuthToken(); 
	// }).then((token) => {
	// 	//custom hearder starts with 'x-'
	// 	res.header('x-auth', token).send(user);
	// }).catch((e) => {
	// 	res.status(400).send(e);
	// })
});

// GET /users/token
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


//POST /users/login
app.post('/users/login', async (req, res) => {

	try {
		const body = lodash.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	}
	catch (e) {
		res.status(400).send();
	}

	// User.findByCredentials(body.email, body.password).then((user) => {
		
	// 	return user.generateAuthToken().then((token) => {
	// 		res.header('x-auth', token).send(user);
	// 	});

	// }).catch((e) => {
	// 	res.status(400).send();
	// });
});


app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	}
	catch (e) {
		res.status(400).send();
	}
	// req.user.removeToken(req.token).then(() => {
	// 	res.status(200).send();
	// }, () => {
	// 	res.status(400).send();
	// });
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