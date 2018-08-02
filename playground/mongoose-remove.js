const {ObjectID} = require('mongodb');
const {mongosse} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User2} = require('./../server/models/user.js')

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });
// 

// Todo.findOneAndRemove({_id: '5b62448288ada11f20a20bd2'}).then((doc) => {
// 	console.log(doc);
// });

Todo.findByIdAndRemove('5b62448288ada11f20a20bd2').then((doc) => {
	console.log(doc);
});