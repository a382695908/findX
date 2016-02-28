String.prototype.format= function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(s,i){
        return args[i];
    });
}
var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
exports.connect= function(h, u, db, pwd, port, charset){
    //return mysql.createConnection({host: 'localhost', user: 'findXmgr', database: 'DB_FINDX', password: 'F1ndX3@r', port: '3306'}); 
    var connection = mysql.createConnection({host: h, user: u, database: db, password: pwd, port: port, charset: charset}); 
    connection.connect(function(err){
        if(err){
              console.log('[query] - :'+err);
            return null;
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

exports.insert_data = function (conn, table,  dobj) {
    console.log( "Insert data to table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_stage_record':
            if ( 'id' in dobj && 'stage' in dobj && 'useTime' in dobj && 'restCnt' in dobj ){
                sql = "INSERT INTO "+table+"(user_id, platform, stage, cost_time)"
                sql+= " VALUES('{0}', '{1}', {2}, {3})".format(dobj.id, "nest", dobj.stage, dobj.useTime*10);
            }
            else{
                console.log("dobj info error:"); console.log(dobj);
            }
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
        else {
            console.error("SQL for table {0} format error:[{1}].".format(table, sql));
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

exports.select_data = function (conn, table,  dobj, res) {
    console.log( "Select data from table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            sql = "SELECT channel, vip, name, pic, sex, age, stage, login_cnt FROM " + table;
            sql+= " WHERE user_id='{0}' AND platform='{1}' ".format(dobj.data.id, "nest");
            break;
        default:
            console.error("unknow table:" + table);
            break;
        }
        if ( sql.length > "SELECT FROM t WHERE".length ){
            conn.query(sql, function(err, rows, fields) { 
                 if (err) {
                    console.error("Execute SQL:["+sql+"] error :"+err);
                    res.send( dobj );
                 }
                else {
                    //console.log(" mysql.query ret:");
                    //console.log( rows );
                    //console.log( fields );
                    //return rows;
                    for(var idx in rows){
                        dobj.data.vip = rows[idx].vip;
                        dobj.data.stage = rows[idx].stage;
                        dobj.data.login_cnt = rows[idx].login_cnt;
                    }
                    res.send( dobj ); // todo: Sent user info, name, img, vip, stage,
                }
            });  
        }
        else{
            res.send( dobj );
        }
    }
    else {
        console.error("Mysql DB connection lost.");
        res.send( dobj );
    }
};

exports.update_data = function (conn, table,  dobj) {
    console.log( "Update data of table: " + table);
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            if ( 'id' in dobj && 'stage' in dobj ){
                if ('stage' in dobj && 'vip' in dobj){
                    sql = "UPDATE {0} SET stage={1}, vip={2} ".format(table, dobj.stage, vip=dobj.vip);
                }
                else if ('stage' in dobj){
                    sql = "UPDATE {0} SET stage={1} ".format(table, dobj.stage);
                }
                else if ('vip' in dobj){
                    sql = "UPDATE {0} SET vip={1} ".format(table, dobj.vip);
                }
                else{
                    console.log("Unown update field for: " + table);
                    break;
                }
                sql+= " WHERE user_id='{0}' AND platform='{1}' AND stage < {2} ".format(dobj.id, "nest", dobj.stage)
            }
            else{
                console.log("dobj info error:"); console.log(dobj);
            }
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
        else {
            console.error("SQL for table {0} format error:[{1}].".format(table, sql));
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

exports.insert_update_data = function (conn, table,  dobj) {
    console.log( "Insert data to table: " + table + " on duplicate update.");
    if ( conn ) {
        var sql = "";
        switch( table ){
        case 't_user':
            if ('data' in dobj && 'id' in dobj.data && 'name' in dobj.data && 'pic' in dobj.data && 'sex' in dobj.data && 'age' in dobj.data){
                sql = "INSERT INTO "+table+"(user_id, platform, name, pic, sex, age, stage, login_time, channel)"
                sql+= " VALUES('{0}', '{1}', '{2}', '{3}', '{4}', {5}, 0, NOW(), {6})".format(dobj.data.id, "nest", dobj.data.name, dobj.data.pic, dobj.data.sex, dobj.data.age, dobj.channel);
                sql+= " ON DUPLICATE KEY UPDATE name='{0}', pic='{1}', sex='{2}', age={3}, channel={4}, login_cnt=login_cnt+1 ".format(dobj.data.name, dobj.data.pic, dobj.data.sex, dobj.data.age, dobj.channel);
            }
            else {
                console.log("dobj info error:"); console.log(dobj);
            }
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
        else{
            console.error("SQL for table {0} format error:[{1}].".format(table, sql));
        }
    }
    else {
        console.error("Mysql DB connection lost.");
    }
};

