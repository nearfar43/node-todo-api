// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    ////Directly find the object using find method
    // db.collection('Todos').find({
    // 	_id: new ObjectID('5b1f5456822dbb1c182cb870')
    // }).toArray().then((docs) => {

    // 	console.log('Todos');
    // 	console.log(JSON.stringify(docs, undefined, 2));

    // }, (err) => {
    // 	console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({}).count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    db.collection('Users').find({name: 'Jen'}).toArray().then((docs) => {

        console.log(JSON.stringify(docs, undefined, 2));
        
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    // client.close();
});


//E:\MongoDB\Server\3.6\bin>mongod.exe --dbpath /E:/mongo-data