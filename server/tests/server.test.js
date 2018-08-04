const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

//POST test
describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => done(e));
		});
	});


	it('should not create todo with invalid body data', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => done(e));
		});
	});
});

//GET test
describe('GET /todos', () => {
	it('should get all the todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});

//GET :id test
describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done)
	});

	it('should return 404 if todo not found', (done) => {
		var hexID = new ObjectID().toHexString();

		request(app)
		.get(`/todos/${hexID}`)
		.expect(404)
		.end(done);

	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);
	});
});

//DELETE :id test
describe('Delete /todos/:id', () => {
	it('should delete a todo', (done) => {
		var hexID = todos[1]._id.toHexString();

		request(app)
		.delete(`/todos/${hexID}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexID);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(hexID).then((todo) => {
				expect(todo).toBeFalsy();
				done();
			}).catch((e) => done(e));
		});

	});

	it('should return 404 if todo not found', (done) => {
		var hexID = new ObjectID().toHexString();
		request(app)
		.delete(`/todos/${hexID}`)
		.expect(404)
		.end(done);

	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
		.delete('/todos/123')
		.expect(404)
		.end(done);
	});
});

//PATCH :id test
describe('PATCH /todos/:id', () => {

	it('should update the todo', (done) => {

		var hexID = todos[0]._id.toHexString();
		var text = 'this is the new FIRST text after PATCH';
		request(app)
		.patch(`/todos/${hexID}`)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(typeof res.body.todo.completedAt).toBe('number');
		})
		.end(done)
	});

	it('should clear completedAt when todo is not completed', (done) => {

		var hexID = todos[1]._id.toHexString();
		var text = 'this is the new SECOND text after PATCH';

		request(app)
		.patch(`/todos/${hexID}`)
		.send({
			completed: false,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toBeNull();
		})
		.end(done)
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = 'passwordExample';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if(err) {
				return done;
			}

			User.findOne({email}).then((user) => {
				expect(user).toBeTruthy();
				expect(user.password).not.toBe(password);
				done();
			}).catch((err) => done(e));
		});

	});

	it('should return validation errors if request invalid', (done) => {
		var email = 'abc';
		var password = '123';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});

	it('should not create a user if email in use', (done) => {
		request(app)
		.post('/users')
		.send({
			email: users[0].email,
			password: 'Password234'
		})
		.expect(400)
		.end(done);

	});
});

describe('POST /users/login', () => {
 	it('should login user and return auth toke', (done) => {
 		request(app)
 		.post('/users/login')
 		.send({
 			email: users[1].email,
 			password: users[1].password
 		})
 		.expect(200)
 		.expect((res) => {
 			expect(res.headers['x-auth']).toBeTruthy();
 		})
 		.end((err, res) => {
 			if (err) {
 				return done(err);
 			}

 			User.findById(users[1]._id).then((user) => {
 				expect(user.toObject().tokens[0]).toMatchObject({
 					access: 'auth',
 					token: res.headers['x-auth']
 				});
 				done();
 			}).catch((e) => done(e));
 		});
 	});

 	// it('should reject invalid login', (done) => {
 	// 	request(app)
 	// 	.post('/users/login')
 	// 	.send({
 	// 		email: users[1].email,
 	// 		password: users[1].password + '1'
 	// 	})
 	// 	.expect(400)
 	// 	.expect((res) => {
 	// 		expect(res.headers['x-auth']).toBeFalsy();
 	// 	})
 	// 	.end((err) => {
 	// 		if (err) {
 	// 			return done(err);
 	// 		}

 	// 		User.findById(users[1]._id).then((user) => {
 	// 			expect(user.tokens.length).toBe(0);  
 	// 			done();
 	// 		});	
 	// 	}).catch((e) => done(e));
 	// });	
});