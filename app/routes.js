module.exports = function(app, connection) {

    function insertUser(callbackFunc, nextFunc) {
        var options = {
            sql: 'insert into user (username) values (?)',
            values: ['renan']
        };
        connection.query(options , function(err, rows, fields) {
            if (err) throw err;
            //console.log('The solution is ', rows[0].solution);
            //console.log(err);
            //console.log(rows);
            //console.log(fields);
            if (callbackFunc != null)
                callbackFunc(nextFunc);
        });
        
    }

    function selectAllUsers(callbackFunc, nextFunc) {
        connection.query('select id, username from user', function(err, rows, fields) {
            if (err) throw err;
            if (callbackFunc != null)
                callbackFunc(nextFunc);
        });
    }

    function insertMonster(monsterName, familyName, elementName, callbackFunc, nextFunc) {
        var options = {
            sql: "insert into monster (family_name, awakened_name, id_element)"+
            "select ? as family_name,"+
            "? as awakened_name,"+
            "(select e.id from element e where e.description = ?) as id_element;",
            values:[familyName, monsterName, elementName]
        };

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            callbackFunc(nextFunc);
        });
    }

    function updateMonster(monsterName, familyName, elementName, callbackFunc, nextFunc) {
        var options  = {
            sql: " update monster " +
            "set family_name = ? " +
            ", awakened_name = ? " + 
            ", id_element = (select e.id from element e where e.description = ?) " +
            "where awakened_name = ? ",
            values:[familyName, monsterName, elementName, monsterName]
        };

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            if (callbackFunc != null)
                callbackFunc(nextFunc);
        });
    }

    function findMonster(monsterName, callbackFunc, nextFunc) {
        var options = {
            sql : "select id from monster where awakened_name = ? ",
            values : [monsterName]
        }

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            for (var i in rows) {
                //console.log(rows[i].id);
            }
            //console.log(rows.length);
            var monsterFound = rows.length > 0;
            callbackFunc(monsterFound);
        });
    }

    function voteMonster(monsterName, idVoteColumn, chosenOption, callbackFunc, nextFunc) {
        
        var vote = -1;
        if (chosenOption)
            vote = 1;
        
        var options = {
            sql: " insert into monster_vote_column (id_monster, id_vote_column, indicator) " +
            " select (select m.id from monster m where m.awakened_name = ?) as id_monster " +
            " , ? as id_vote_column " +
            " , ? as indicator ",
            values : [monsterName, idVoteColumn, vote]
        };

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            if (callbackFunc != null)
                callbackFunc(nextFunc);
        });
    }

    function startDatabase(callbackFunc) {
        var querySQL = 
            " truncate table monster_vote_column; " +
            " truncate table monster; " +
            " truncate table user; " +
            " truncate table vote_column; " +
            " insert into monster (family_name, awakened_name, id_element)  " +
            " select 'Pierret' " +
            " , 'Clara' " +
            " , 1; " +
            " insert into monster (family_name, awakened_name, id_element)  " +
            " select 'Oracle' " +
            " , 'Seara' " +
            " , 3; " +
            " insert into user (username) " +
            " select 'Renan'; " +
            " insert into vote_column (points, short_description, full_description) " +
            " select 5 " +
            " , 'PvE' " +
            " , 'A good monster for PvE situation';  " +
            " insert into vote_column (points, short_description, full_description) " +
            " select 6 " +
            " , 'PvP' " +
            " , 'A good monster for PvP situation';  ";

        var options = {
            sql : querySQL   
        };

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            callbackFunc();
        });
    }

    function getReport(callbackFunc) {
        var options = {
            sql : 
            " drop temporary table if exists vote_results; " +
            " create temporary table vote_results ( " +
            " id_monster int, " +
            " family_name varchar(100), " +
            " awakened_name varchar(100), " +
            " element varchar(100), " +
            " id_vote_column int, " +
            " vote_column_description varchar(100), " +
            " number_of_votes int " +
            " ); " +
            " insert into  vote_results (id_monster,family_name, awakened_name, element, id_vote_column, vote_column_description, number_of_votes) " +
            " select m.id " +
            " , m.family_name " +
            " , m.awakened_name " +
            " , e.description as element " +
            " , vc.id as id_vote_column " +
            " , vc.short_description as vote_column_description " +
            " , (select sum(mvc.indicator) * vc.points from monster_vote_column mvc where mvc.id_monster = m.id and mvc.id_vote_column = vc.id) as number_of_votes " +
            " from monster m " +
            " inner join element e on e.id = m.id_element " +
            " cross join vote_column vc " +
            " ; " +
            " select  " +
            " id_monster " + 
            " ,family_name " +
            " ,awakened_name " +
            " ,element " +
            " ,vote_column_description " +
            " ,COALESCE(number_of_votes,0) as number_of_votes " +
            " from vote_results " +
            " order by awakened_name, family_name " +
            " ; "
        };

        connection.query(options, function(err, rows, fields) {
            if (err) throw err;
            var retorno = [];
            if (rows.length > 0) {
                for (var i in rows) {
                    
                    if(rows[i].constructor.name == 'Array') {

                        for (var j in rows[i]) {
                            var monster = new Object();
                            monster.id_monster = rows[i][j].id_monster;
                            monster.family_name = rows[i][j].family_name;
                            monster.awakened_name = rows[i][j].awakened_name;
                            monster.element = rows[i][j].element;
                            monster.vote_column_description = rows[i][j].vote_column_description;
                            monster.number_of_votes = rows[i][j].number_of_votes;
                            //console.log(rows[i][j]);
                            //console.log(monster);
                            retorno.push(monster);
                        }

                    }
                }
            }

            callbackFunc(retorno);
        });
    }

    app.get('/', function(req,res) {
        
        // insertUser(selectAllUsers, function() {
        //     res.render('index', {'success': true});
        // });

        selectAllUsers(function() {
            res.render('index', { 'message': "That's all folks!"});
        }, null);
    });

    app.post('/api/monster', function(req,res) {

        var monsterName = req.body.monster_name;
        var familyName = req.body.family_name;
        var elementName = req.body.element_name;

        findMonster(monsterName, function(monsterFound) {
            if (monsterFound) {
                updateMonster(monsterName, familyName, elementName, function(err) {
                    if (err) throw err;
                    res.render('index', {'message': 'Monster ' + monsterName + ' updated.'});
                });
            } else {
                insertMonster(monsterName, familyName, elementName, function(err) {
                    if (err) throw err;
                    res.render('index', {'message': 'Monster ' + monsterName + ' inserted.'}); 
                });
            }
        }, null);

        
    });

    app.get('/api/monster/:name', function(req,res) {
        var name = req.params.name;
        findMonster(name, function(monsterFound) {
            if (monsterFound) {

            }
            res.render('index', {'message': 'That\'s all folks!'});
        });
    });

    app.get('/vote_test', function(req,res) {
        res.render('pages/vote_test', {'message': 'ok'});
    });

    app.post('/api/vote', function(req,res) {
        var chosenOption = req.body.option;
        var monsterName = req.body.monster_name;
        var idVoteColumn = req.body.id_vote;
        if (chosenOption == 'true')
            chosenOption = true;
        else
            chosenOption = false;

        findMonster(monsterName, function(monsterFound) {
            if (monsterFound) {
                voteMonster(monsterName, idVoteColumn, chosenOption, function(err) {
                    if (err) throw err;
                    if (chosenOption)
                        res.json({'success' : 'Yeees!!'});
                    else 
                        res.json({'success' : 'Noooo!!'});
                });

            } else {
                res.json({'success' : 'Monster not found!!'});
            }
        });
    });

    app.get('/api/start_database', function(req,res) {
        startDatabase(function() {
            var result = {
                'message' : 'OK'
            };
            res.json(result);
        });
    });
    
    app.get('/api/monster', function(req,res) {
        getReport(function(resultado) {
            var result = {
                success : true,
                monster: resultado
            };
            res.json(result);
        });
    });
}