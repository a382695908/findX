/**
   *  通过 node ./webserver.js 启动本服务
*/

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
var express=require("express");
var os = require('os');  
var path = require('path');  
var fs = require('fs');  
var qs = require('querystring');

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
    
    app.set("view engine","ejs"); 
    app.get("/", function(req, res) {
    	var cip = getClientIp( req );
    	console.log("GET req from client IP:" + cip );
        var full_url = wx_base_url + req.url;
    	console.log('Full URL:' + full_url);
    	https.get(wx_tkn_url, function access_token_callback(tk_rs){
    		tk_rs.on('data', function(dt) {
    			var str_data = dt.toString();
    			var token = JSON.parse(str_data)['access_token'];
    			console.log("token: " + token);
    			https.get(wx_tkt_url_base+'access_token='+token+'&type=jsapi', function ticket_callback(tc_res){
    					var tc_body = [];
    					tc_res.on('data', function(dt) {
    						var dt_tc = dt.toString();
    						var ticket = JSON.parse( dt_tc )['ticket'];
    						console.log("ticket: " + ticket);
    						var noncestr = Math.random().toString(36).substr(2, 15);
    						var ts = parseInt(new Date().getTime() / 1000) + '';
    
    						var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + full_url;
              				var shaObj = new jsSHA('SHA-1', 'TEXT');
    						shaObj.update( str );
              				var sign = shaObj.getHash('HEX');
    						var tpl_var = {'wx_debug': wx_debug, 'wx_appid': wx_appid, 'wx_ts': ts, 'wx_str': noncestr, 'wx_sig': sign,
                                           'wx_title': wx_title, 'wx_desc': wx_desc, 'wx_link': wx_link, 'wx_img':wx_img };
    						console.log( "template var:");
    						console.log( tpl_var );
        					res.render("index", tpl_var);  
    				    });
    			});
    		});
    	});
    });
    
}
else if ( enable_nest ){
    console.log("ENABLED NEST.");
    app.set("view engine","ejs"); 
    app.get("/", function(req, res) {
    	var tpl_var = {'nt_debug': true, 'nt_appid': 89901, 'nt_version': 2 };
    	res.render("index_nest", tpl_var);  
	});
}
else{
    console.log("DISABLED WEIXIN.");
    app.get("/", function(req, res) {
    	var cip = getClientIp( req );
    	console.log("GET req from client IP:" + cip );
		res.sendFile('index.html', { root: path.join(__dirname, '.') });
	});
}

app.post("/saveStage/", function(req, res) {
	var cip = getClientIp( req );
	console.log("POST req from client IP:" + cip );
    var data = '';
    req.on('data', function(chunk){
        data = chunk;
    });
    req.on('end', function(){
        var params = qs.parse(data.toString('utf-8'));
        var pStr = JSON.stringify(params);
        var now_time = new Date();
	    var log = now_time.format("[yyyy-MM-dd hh:mm:ss]") + " Client [" + cip + "] post data: " + pStr + "\n";
        file_log(fs, log);
        res.send( params );
    });
});

app.use(express.static('.'));
console.log("Listen on host: " + lsip + ", port:" + lsport);
app.listen(lsport, lsip);
