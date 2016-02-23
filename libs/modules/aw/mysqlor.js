var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
var connection = mysql.createConnection({     
  host     : 'localhost',       //主机
  user     : 'findXmgr',        //MySQL认证用户名
  db       : 'DB_FINDX',        //MySQL认证用户名
  password : 'F1ndX3@r',        //MySQL认证用户密码
  port: '3306',                 //端口号
}); 
//创建一个connection
connection.connect(function(err){
    if(err){        
          console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});  
//执行SQL语句
connection.query('select version() ', function(err, rows, fields) { 
     if (err) {
             console.log('[query] - :'+err);
        return;
     }
     console.log('The solution is: ', rows[0]);  
});  
//关闭connection
connection.end(function(err){
    if(err){        
        return;
    }
      console.log('[connection end] succeed!');
});

