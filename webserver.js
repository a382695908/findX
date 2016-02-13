/**
   *  通过 node ./webserver.js 启动本服务
*/

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
};


var appid='wxe62c6539ac7d4fdd';
var secret='65f845807ed35d21e8e7155fb3e1cc90';
var base_url='http://h53d.doogga.com';
//var base_url='http://dev.doogga.com';
var port = 9000;
var wx_tkn_url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret;
var wx_tkt_url_base='https://api.weixin.qq.com/cgi-bin/ticket/getticket?';

var https = require('https');
var express=require("express");
var jsSHA = require("jssha");
//var wx_debug = true;
var wx_debug = false;

var app=express();
app.set("view engine","ejs"); 

app.get("/", function(req, res) {
	var ip = getClientIp( req );
	console.log("req from client IP:" + ip );
    var full_url = base_url + req.url;
	console.log('Full URL:' + full_url);
	https.get(wx_tkn_url, function access_token_callback(tk_rs){
		tk_rs.on('data', function(dt) {
			var str_data = dt.toString();
			//console.log(str_data);
			//console.log("Get token data finished.");
			var token = JSON.parse(str_data)['access_token'];
			console.log("token: " + token);
			https.get(wx_tkt_url_base+'access_token='+token+'&type=jsapi', function ticket_callback(tc_res){
					var tc_body = [];
					tc_res.on('data', function(dt) {
						var dt_tc = dt.toString();
						//console.log(dt_tc);
						var ticket = JSON.parse( dt_tc )['ticket'];
						console.log("ticket: " + ticket);
						var noncestr = Math.random().toString(36).substr(2, 15);
						var ts = parseInt(new Date().getTime() / 1000) + '';

						var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + full_url;
          				var shaObj = new jsSHA('SHA-1', 'TEXT');
						shaObj.update( str );
          				var sign = shaObj.getHash('HEX');
						var tpl_var = {'wx_debug': wx_debug, 'wx_appid': appid, 'wx_ts': ts, 'wx_str': noncestr, 'wx_sig': sign };
						console.log( "template var:");
						console.log( tpl_var );
    					res.render("index", tpl_var);  
				    });
			});
		});
	});
});

app.use(express.static('.'));

console.log("host: " + base_url );
console.log("port: " + port );
app.listen(port);
