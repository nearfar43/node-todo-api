// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();

// console.log(obj);

// //distruct object
// var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');


	// db.collection('Todos').insertOne({

	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));

	// });
	
	////insert new data
	// db.collection('Users').insertOne({
	// 	name: 'Andrew',
	// 	age: 25,
	// 	location: 'CA'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}

	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	client.close();
});

//server host
//E:\MongoDB\Server\3.6\bin>mongod.exe --dbpath E:/mongo-data