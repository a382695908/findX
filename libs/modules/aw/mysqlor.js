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
};

exports.select_data = function (conn, table,  data_obj) {
    console.log( "Select data from table: " + table);
};

exports.update_data = function (conn, table,  data_obj) {
    console.log( "Update data of table: " + table);
};

exports.insert_update_data = function (conn, table,  data_obj) {
    console.log( "Insert data to table: " + table + " on duplicate update.");
};

