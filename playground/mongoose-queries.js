const {ObjectID} = require('mongodb');
const {mongosse} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User2} = require('./../server/models/user.js')

// var id = '5b61fba2a0475d041cd59528';

// if(!ObjectID.isValid(id)) {
// 	console.log('id not valid');
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('TodoFindOne', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('Id not found');
// 	}
// 	console.log('TodoById', todo);
// }).catch((e) => console.log(e));

var userID = '5b4e5b2d06b93539ccdc156e';

User2.findById(userID).then((user) => {
	if (!user) {
		return console.log('user id not found');
	}

	//console.log('UserById', user);
	console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));