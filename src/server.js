const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
// importing dotenv with environment variables
require('dotenv/config');

// instantiating express
const app = express();

const http = require('http');

// instantiating http
const server = http.createServer(app);

// setting the session
app.use(
	session({
		secret: process.env.SESSION_PASS,
		resave: true,
		saveUninitialized: true
	})
);

// importing routes
const users = require('./routes/users');
const questions = require('./routes/questions');

// hability assets
app.use('/public', express.static(path.join(__dirname, '/public')));

// setting template engine
app.engine(
	'hbs',
	hbs({
		defaultLayout: 'master.hbs',
		extname: '.hbs'
	})
);

// specifying path to views
app.set('views', path.join(__dirname, './views'));

// specifying template engine
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// creating the locals middleware
app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

// adding routes
app.use(users);
app.use(questions);

// server listener
server.listen(process.env.PORT || 3333, () => {
	// eslint-disable-next-line no-console
	console.log(`Listening on port ${process.env.HOST}:${process.env.PORT}`);
});
