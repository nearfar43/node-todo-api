// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //find one and update 
    
    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5b40020fff01c742d24b0dde")},
    //     {
    //         $set: {
    //             completed: true
    //     }}, {
    //             returnOriginal: false
    //         }).then((result) => {
    //             console.log(result);
    //         });
    

    db.collection('Users').findOneAndUpdate({_id: new ObjectID("5b25bf336e65d8155cf769e8")},
    {
        $set: {
            name: 'Jeffrey'
        },

        $inc: {
            age: 1
        }

    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    
    //client.close();
});

