var express = require('express');
var session = require('express-session');
var app = express();
var bodyparser = require('body-parser');
app.use(session({secret: 'japonesmaluco'}));

app.set('view engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : true}));
app.use(express.static(__dirname + '/public'));


var database_options = {
	host: 'localhost',
	user: 'thelannister',
	password: 'hailtotheredlion',
    database: 'db_summoners',
    multipleStatements : true
};

var mysql = require('mysql');
var connection = mysql.createConnection(database_options);

connection.connect();

require('./config/data')(connection);

require('./app/routes.js')(app, connection);

var porta = process.env.PORT || 3192;
app.listen(porta);
console.log('Rodando na porta 3192');
