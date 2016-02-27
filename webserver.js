/**
   *  通过 node ./webserver.js 启动本服务
*/
String.prototype.format= function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(s,i){
        return args[i];
    });
}

Date.prototype.format = function(fmt)   
{ //author: meizz   
    var o = {   
      "M+" : this.getMonth()+1,                 //月份   
      "d+" : this.getDate(),                    //日   
      "h+" : this.getHours(),                   //小时   
      "m+" : this.getMinutes(),                 //分   
      "s+" : this.getSeconds(),                 //秒   
      "q+" : Math.floor((this.getMonth()+3)/3), //季度   
      "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
      if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
} 

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
};

function getLocalIp(os)
{
    var netcards = null;
    switch( os.platform() ){
    case 'linux':
        netcards = os.networkInterfaces().eth0;
        break;
    case 'darwin':
        netcards = os.networkInterfaces().en0;
        break;
    case 'windows':
        netcards = null;
        break;
    default:
        netcards = null;
        break;
    }
    var IPv4 = "unknown";
    if ( netcards ) {
        for(var i=0; i< netcards.length;i++){  
            if( netcards[i].family=='IPv4' ){  
                IPv4=netcards[i].address;  
            }  
        } 
    }
    console.log('LOCAL IP: ' + IPv4 );  
    console.log('LOCAL HOST: '+ os.hostname() );  
    return IPv4;
}

function post_data(url, data, fn){
    data=data||{};
    var content=require('querystring').stringify(data);
    console.log("Post data to NEST server:" + content);
    var parse_u=require('url').parse(url,true);
    var isHttp=parse_u.protocol=='http:';
    var options={
        host:parse_u.hostname,
        port:parse_u.port||(isHttp?80:443),
        path:parse_u.path,
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':content.length
         }
    };
    var req = require(isHttp?'http':'https').request(options,function(res){
        var _data='';
        res.on('data', function(chunk){
            _data += chunk;
        });
        res.on('end', function(){
            fn!=undefined && fn(_data);
        });
    });
    req.write(content);
    req.end();
}

// params 已经按nest的要求排序
function make_nt_sign(params, nt_appkey, crypt) {
    var arrayObj = [];
    for (var key in params) {
        arrayObj.push( [ key, params[key] ] );
    }
    arrayObj.sort( function(a, b){
        if ( a[0].toString() < b[0].toString() ) {
            return -1;
        }
        else if ( a[0].toString() == b[0].toString()){
            return 0;
        }
        else{
            return 1;
        }
    });

    var signStr = "";
    var sortParams = {};
    for (var idx in arrayObj) {
        signStr += arrayObj[idx][0] + "=" + arrayObj[idx][1];
        sortParams[arrayObj[idx][0]] = arrayObj[idx][1];
    }
    signStr += nt_appkey;
    sortParams.sign = crypt.createHash('md5').update(signStr).digest('hex');
    return sortParams;
}


function file_log(fs, txt){
    fs.appendFile("./findx.log", txt, function (err) {
        if (err) throw err ;
    }) ;
}


// config
var lsip = "localhost";
var lsport = 9000;
var enable_weixin = false;

var enable_nest = false;


//base lib
var https = require('https');
var http = require('http');
var express=require("express");
var os = require('os');  
var path = require('path');  
var fs = require('fs');  
var qs = require('querystring');

var mysql = require('./libs/modules/aw/mysqlor.js');
var mysql_conn = mysql.connect('localhost', 'findXmgr', 'DB_FINDX', 'F1ndX3@r', '3306', 'utf8'); 
setInterval(function () { mysql_conn.query('SELECT 1'); }, 3600);

var sip = getLocalIp(os);
switch( sip ){
case '192.168.1.5':    // my home
    enable_weixin = false;
	enable_nest = true;
    lsip = "localhost";
    break;
case '10.1.16.170':    // my dev
    enable_weixin = false;
	enable_nest = true;
    lsip = "localhost";
    break;
case '10.144.212.27':  // my aliyun
    enable_weixin = false;
	enable_nest = true;
    lsip = "localhost";
    break;
case '10.10.123.207':  // huithink server
    enable_weixin = true;
    lsip = "localhost";
    break;
case '172.17.0.168':  // egret-3d server
    enable_weixin = false;
	enable_nest = true;
    lsip = "localhost";
    break;
default:
    lsip = sip;
    enable_weixin = false;
	enable_nest = true;
    break;
}
//enable_weixin = true;
//sip='10.10.123.207';


// frame work code
var app=express();
app.enable('trust proxy');

if ( enable_weixin ) {
    console.log("ENABLED WEIXIN.");
    var wx_debug = true;
    wx_debug = false;
    var jsSHA = require("jssha");

    var wx_appid='wxe62c6539ac7d4fdd';
    var wx_secret='65f845807ed35d21e8e7155fb3e1cc90';
    var wx_base_url='http://findx.h53d.io';

    switch( sip ){
    case '10.144.212.27':  // my aliyun
        wx_appid='wxe62c6539ac7d4fdd';
        wx_secret='65f845807ed35d21e8e7155fb3e1cc90';
        wx_base_url='http://h53d.doogga.com';
        wx_link ='http://h53d.doogga.com/';
        wx_img  ='http://img.open.egret.com/game/gameIcon/179/89901/icon_200.png';
        wx_title='大家来 - 找X';
        wx_desc ='猴年大吉,恭喜发财. 快来试试你的手机能玩微信3D游戏不?';
        break;
    case '10.10.123.207':  // huithink server
        wx_appid='wx85052b16beec339e';
        wx_secret='4f5aa5a9c6e318e4477ae9e388cd009e';
        wx_base_url='http://findx.huithink.com';
        wx_link ='http://findx.huithink.com/';
        wx_img ='http://findx.huithink.com/resource/findx.jpg';
        wx_title='大家来 - 找X';
        wx_desc ='猴年大吉,恭喜发财. 快来试试你的手机能玩微信3D游戏不?';
        break;
    default: // any other
        wx_appid='wxe62c6539ac7d4fdd';
        wx_secret='65f845807ed35d21e8e7155fb3e1cc90';
        wx_base_url='http://dev.h53d.io';
        wx_link ='http://h53d.doogga.com/';
        wx_img ='http://img.open.egret.com/game/gameIcon/179/89901/icon_200.png';
        wx_title='大家来 - 找X';
        wx_desc ='猴年大吉,恭喜发财. 快来试试你的手机能玩微信3D游戏不?';
        break;
    }
    var wx_tkn_url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+wx_appid+'&secret='+wx_secret;
    var wx_tkt_url_base='https://api.weixin.qq.com/cgi-bin/ticket/getticket?';
	var wx_get_tmstamp = 0;
	var wx_expires_in = 0;
	var wx_ts = 0;
	var wx_str= "";
	var wx_sig="";
    
    app.set("view engine","ejs"); 
    app.get("/", function(req, res) {
        var now_time = new Date();
    	var now_ts = parseInt(now_time.getTime() / 1000);
    	var cip = getClientIp( req );
	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " GET req from client IP:" + cip + "\n";
    	console.log( log );
        file_log(fs, log);
        var full_url = wx_base_url + req.url;
    	console.log('Full URL:' + full_url);
		if (wx_str.length > 10 && wx_sig.length > 0 && (now_ts - wx_ts ) < (wx_expires_in-60) ) {
    		var tpl_var = {'wx_debug': wx_debug, 'wx_appid': wx_appid, 'wx_ts': wx_ts, 'wx_str': wx_str, 'wx_sig': wx_sig,
        	               'wx_title': wx_title, 'wx_desc': wx_desc, 'wx_link': wx_link, 'wx_img':wx_img };
    		console.log( "Old template var for weixin config:");
    		console.log( tpl_var );
        	res.render("index", tpl_var);  
		}
		else {
    		https.get(wx_tkn_url, function (tk_rs){
    			tk_rs.on('data', function(dt) {
    				var str_data = dt.toString();
    				var token = JSON.parse(str_data)['access_token'];
    				console.log("token: " + token);
    				https.get(wx_tkt_url_base+'access_token='+token+'&type=jsapi', function ticket_callback(tc_res){
    						var tc_body = [];
    						tc_res.on('data', function(dt) {
    							var dt_tc = dt.toString();
    							console.log("Got ticket info: " + dt_tc);
    							var ticket_obj = JSON.parse( dt_tc );
								if ('errcode' in ticket_obj && ticket_obj['errcode'] == 0 && 'ticket' in ticket_obj && 'expires_in' in ticket_obj) {
    								var ticket = ticket_obj['ticket'];
									wx_expires_in = ticket_obj['expires_in'];	

    								wx_str = Math.random().toString(36).substr(2, 15);
    								wx_ts = parseInt(new Date().getTime() / 1000);
									wx_get_tmstamp = wx_ts;	
    
    								var str = 'jsapi_ticket=' + ticket + '&noncestr=' + wx_str + '&timestamp='+ wx_ts +'&url=' + full_url;
        	      					var shaObj = new jsSHA('SHA-1', 'TEXT');
    								shaObj.update( str );
        	      					wx_sig = shaObj.getHash('HEX');
    								var tpl_var = {'wx_debug': wx_debug, 'wx_appid': wx_appid, 'wx_ts': wx_ts, 'wx_str': wx_str, 'wx_sig': wx_sig,
        	                    	               'wx_title': wx_title, 'wx_desc': wx_desc, 'wx_link': wx_link, 'wx_img':wx_img };
    								console.log( "New template var for weixin config:");
    								console.log( tpl_var );
        							res.render("index", tpl_var);  
								}
								else {
									console.log("ERROR, get ticket with access token return with error data.");
								}
    					    });
    				});
    			});
    		});
		}
    });
}
else if ( enable_nest ){
    var crypt = require('crypto');
    var nt_debug = true;
    var nt_appid = 89901;
    var nt_version = 2;
    var nt_appkey = "gadoiHaTO1IJY6MLKwhbF";
    var nt_token_url = "http://api.egret-labs.org/v2/user/getInfo";

    var ntUserToken = "";

    console.log("ENABLED NEST.");
    app.set("view engine","ejs"); 
    app.get("/", function(req, res) {
        var channel = 0;
        if ( req.query.channelId ){
            channel = req.query.channelId;
        }
    	var cip = getClientIp( req );
        var now_time = new Date();
	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " GET req from client IP:" + cip + "\n";
    	console.log( log );
        file_log(fs, log);
    	var tpl_var = {'nt_debug': nt_debug, 'nt_appid': nt_appid, 'nt_version': nt_version, 'nt_channel': channel };
    	res.render("index_nest", tpl_var);  
	});

    app.post("/userToken/", function(req, res) {
    	var cip = getClientIp( req );
        var now_time = new Date();
    	console.log(now_time.format("[yyyy-MM-dd hh:mm:ss]") + " POST user token from client IP:" + cip );
        var data = '';
        req.on('data', function(chunk){
            data = chunk;
        });
        req.on('end', function(){
            var params = qs.parse(data.toString('utf-8'));
            var pStr = JSON.stringify(params);
    	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " Client [" + cip + "] post data: " + pStr + "\n";
            file_log(fs, log);
            if ('token' in params && 'channel' in params && params.token.length > 0) {
                var requestParams = { appId: nt_appid, action: "user.getInfo", 
                                        time: Date.now(), serverId: 1, token: params.token };
                var signParams = make_nt_sign(requestParams, nt_appkey,  crypt);
                post_data(nt_token_url, signParams, function(data){
                    var dataObj = JSON.parse(data.toString('utf-8'));
                    if ('code' in dataObj && 'msg' in dataObj && 'data' in dataObj){
                        if ( dataObj['code'] == 0 ) {
                            dataObj.channel = params .channel;
                            console.log(dataObj['data']);
                            mysql.insert_update_data(mysql_conn, 't_user', dataObj );
                            res.send( dataObj );
                        }
                        else{
                            console.log(dataObj['code'] + ": " + dataObj['msg'] );
                        }
                    }
                    else {
                        console.log(data);
                    }
                });

            }
        });
    });

    app.post("/pay/findX/", function(req, res) {
	    var cip = getClientIp( req );
        var now_time = new Date();
	    console.log(now_time.format("[yyyy-MM-dd hh:mm:ss]") + " POST pay data from NEST SERVER IP:" + cip );
        var data = '';
        req.on('data', function(chunk){
            data = chunk;
        });
        req.on('end', function(){
            var params = qs.parse(data.toString('utf-8'));
            mysql.insert_data(mysql_conn, 't_vip_record', params );
            mysql.update_data(mysql_conn, 't_user', params );

            var pStr = JSON.stringify(params);
	        var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " Client [" + cip + "] post data: " + pStr + "\n";
            file_log(fs, log);
        });
    });
}
else{
    console.log("NO 3ird SDK API CALL.");
    app.get("/", function(req, res) {
    	var cip = getClientIp( req );
        var now_time = new Date();
	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " GET req from client IP:" + cip + "\n";
    	console.log( log );
        file_log(fs, log);
		res.sendFile('index.html', { root: path.join(__dirname, '.') });
	});
}

app.post("/saveStage/", function(req, res) {
	var cip = getClientIp( req );
    var now_time = new Date();
	console.log(now_time.format("[yyyy-MM-dd hh:mm:ss]") + " POST req from client IP:" + cip );
    var data = '';
    req.on('data', function(chunk){
        data = chunk;
    });
    req.on('end', function(){
        var params = qs.parse(data.toString('utf-8'));
        var pStr = JSON.stringify(params);
	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " Client [" + cip + "] post data: " + pStr + "\n";
        file_log(fs, log);
        res.send( params );
        mysql.update_data(mysql_conn, 't_user', params );
        var ret = mysql.insert_data(mysql_conn, 't_stage_record', params );
        if ( enable_nest && 'id' in params && 'stage' ){
            var crypt = require('crypto');
            var nt_debug = true;
            var nt_appid = 89901;
            var nt_version = 2;
            var nt_appkey = "gadoiHaTO1IJY6MLKwhbF";
            var nt_token_url = "http://api.egret-labs.org/v2/user/setAchievement";
            var requestParams = { id: params.id, time: Date.now(), appId: nt_appid, 
                                    serverId: 1, score: params.stage};
            var signParams = make_nt_sign(requestParams, nt_appkey,  crypt);
            post_data(nt_token_url, signParams, function(data){
                var dataObj = JSON.parse(data.toString('utf-8'));
                if ('code' in dataObj && 'msg' in dataObj && 'data' in dataObj){
                    if ( dataObj['code'] == 0 ) {
                        console.log("Commit data to nest serer ok");
                    }
                    else{
                        console.log("Commit data to nest serer wrong, ret code:" + dataObj.code+" desc:" + dataObj.msg);
                    }
                }
                else {
                    console.log("Commit data to nest serer wrong:");
                    console.log(data);
                }
            });
        }
    });
});

app.use(express.static('.'));
console.log("Listen on host: " + lsip + ", port:" + lsport);
app.listen(lsport, lsip);

