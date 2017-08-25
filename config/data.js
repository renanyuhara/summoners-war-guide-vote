module.exports = function(connection) {
    //connection.connect();
    
    var sqlCreateInfo = '';

	var sqlCreateUsers = 'CREATE table IF NOT EXISTS user (' +
	'id int not null auto_increment,' +
	'username varchar(30),' + 
	'primary key (id) ' +
    ');';

    
    var sqlCreateMonster = 'create table if not exists monster ('+
        'id int not null auto_increment,' + 
        'family_name varchar(40), ' + 
        'awakened_name varchar(40),' +
        'id_element int,' + 
        'primary key (id)' +
        ');';

    var sqlCreateElement = 'create table if not exists element (' + 
    'id int not null,' +
    'description varchar(20), ' + 
    'primary key (id)' +
    ');';

    var sqlCreateVoteColumns = 
    'create table if not exists vote_column (' +
    'id int not null auto_increment,'+
    'points int,' +
    'short_description varchar(100),' +
    'full_description text,'+ 
    'primary key (id)' +
    ');';

    var sqlCreateMonterVoteColumns  =
    'create table if not exists monster_vote_column (' +
    'id int not null auto_increment, ' +
    'id_monster int,'+
    'id_vote_column int,'+
    'id_user int,' +
    'indicator int, ' +
    'primary key (id)'+
    ');';

    var sqlInsertElements = 
    "truncate table element;" + 
    "insert into element (id, description) " +
    "select 1, 'Fire' " +
    "union select 2, 'Water' " +
    "union select 3, 'Wind' " +
    "union select 4, 'Light' " +
    "union select 5, 'Dark'; ";

    sqlCreateInfo += sqlCreateUsers;
    sqlCreateInfo += sqlCreateMonster;
    sqlCreateInfo += sqlCreateElement;
    sqlCreateInfo += sqlCreateVoteColumns;
    sqlCreateInfo += sqlCreateMonterVoteColumns;

    sqlCreateInfo += sqlInsertElements;

    connection.query(sqlCreateInfo, function(err, rows, fields) {
        if (err) throw err;
        console.log('Database started successfully.');
    });

    
/*
	connection.query('select id from usuarios', function(err, rows, fields) {
		if (err) throw err;
		//console.log('The solution is ', rows[0].solution);
		//console.log(err);
		//console.log(rows);
		//console.log(fields);
	});
*/
	//connection.end();
};