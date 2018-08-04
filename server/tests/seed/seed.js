const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

//user test array
const users = [{
	_id: userOneID,
	email: 'andrewTest@example.com',
	password: 'userHasToken',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoID,
	email: 'jen@example.com',
	password: 'userNoToken'

}];

//todo test array
const todos = [{
	_id: new ObjectID(),
	text: 'First'
}, {
	_id: new ObjectID(),
	text: 'Second',
	completed: true,
	completedAt: 123
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => {
		done();
	});
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();
		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {
	todos: todos,
	populateTodos: populateTodos,
	users: users,
	populateUsers: populateUsers
};