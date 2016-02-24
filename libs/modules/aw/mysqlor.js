var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
exports.connect= function(h, u, db, pwd, port, charset){
    //return mysql.createConnection({host: 'localhost', user: 'findXmgr', db: 'DB_FINDX', password: 'F1ndX3@r', port: '3306'}); 
    var connection = mysql.createConnection({host: h, user: u, db: db, password: pwd, port: port, charset: charset}); 
    connection.connect(function(err){
        if(err){
              console.log('[query] - :'+err);
            return;
        }
        console.log('[connection connect]  succeed!');
    });
    return connection;
}

//关闭connection
exports.close= function(conn){
    conn.end(function(err){
        if(err){        
            return;
        }
        console.log('[connection end] succeed!');
    });
};

//创建一个connection
//connection.connect(function(err){
//    if(err){        
//          console.log('[query] - :'+err);
//        return;
//    }
//    console.log('[connection connect]  succeed!');
//});  
////执行SQL语句
//connection.query('select version() ', function(err, rows, fields) { 
//     if (err) {
//             console.log('[query] - :'+err);
//        return;
//     }
//     console.log('The solution is: ', rows[0]);  
//});  

exports.insert_data = function (conn, table,  data_obj) {
    console.log( "Insert data to table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            sql = "INSERT INTO "+table+"(user_id, channel, name, pic, sex, age, vip, stage, login_time) VALUES() ";
            break;
        default:
            console.error("unknow table:" + table);
            break;
        }
        if ( sql.length > "INSERT INTO t() VALUES()".length ){
            conn.query(sql, function(err, rows, fields) { 
                 if (err) {
                    console.error("Execute SQL:["+sql+"] error :"+err);
                    return;
                 }
            });  
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

exports.select_data = function (conn, table,  data_obj) {
    console.log( "Select data from table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            sql = "SELECT * FROM "+table+" WHERE ";
            break;
        default:
            console.error("unknow table:" + table);
            break;
        }
        if ( sql.length > "SELECT FROM t WHERE".length ){
            conn.query(sql, function(err, rows, fields) { 
                 if (err) {
                    console.error("Execute SQL:["+sql+"] error :"+err);
                    return;
                 }
            });  
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

exports.update_data = function (conn, table,  data_obj) {
    console.log( "Update data of table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            sql = "UPDATE "+table+" SET a=b ";
            break;
        default:
            console.error("unknow table:" + table);
            break;
        }
        if ( sql.length > "UPDATE  WHERE".length ){
            conn.query(sql, function(err, rows, fields) { 
                 if (err) {
                    console.error("Execute SQL:["+sql+"] error :"+err);
                    return;
                 }
            });  
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

exports.insert_update_data = function (conn, table,  data_obj) {
    console.log( "Insert data to table: " + table + " on duplicate update.");
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            sql = "INSERT INTO "+table+"(user_id, channel, name, pic, sex, age, vip, stage, login_time) VALUES() ON DUPLICATE UPDATE ...";
            break;
        default:
            console.error("unknow table:" + table);
            break;
        }
        if ( sql.length > "INSERT INTO t() VALUES() ON DUPLICATE UPDATE ...".length ){
            conn.query(sql, function(err, rows, fields) { 
                 if (err) {
                    console.error("Execute SQL:["+sql+"] error :"+err);
                    return;
                 }
            });  
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

