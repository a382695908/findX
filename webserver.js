/**
   *  通过 node ./webserver.js 启动本服务
*/

var wx_tkn_url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx74751108b881f39c&secret=69440fcc8885e85ac4c285eff34782e7';
var wx_tkt_url_base='https://api.weixin.qq.com/cgi-bin/ticket/getticket?';
var my_url="http://h53d.doogga.com/";
var port = 9000;

var https = require('https');
var express=require("express");
var jsSHA = require("jssha");

var app=express();
app.set("view engine","ejs"); 

app.get("/",function(req, res) {
	//console.log('1');
	https.get(wx_tkn_url, function access_token_callback(tk_rs){
		//console.log('2');
		tk_rs.on('data', function(dt) {
			//console.log('3');
			var str_data = dt.toString();
			//console.log(str_data);
			//console.log("Get token data finished.");
			var token = JSON.parse(str_data)['access_token'];
			console.log("token: " + token);
			https.get(wx_tkt_url_base+'access_token='+token+'&type=jsapi', function ticket_callback(tc_res){
					//console.log('4');
					var tc_body = [];
					tc_res.on('data', function(dt) {
						//console.log('6');
						var dt_tc = dt.toString();
						//console.log(dt_tc);
						var ticket = JSON.parse( dt_tc )['ticket'];
						console.log("ticket: " + ticket);
						var noncestr = Math.random().toString(36).substr(2, 15);
						var ts = parseInt(new Date().getTime() / 1000) + '';

						var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + my_url;
          				var shaObj = new jsSHA('SHA-1', 'TEXT');
						shaObj.update( str );
          				var sign = shaObj.getHash('HEX');
						var tpl_var = {'wx_ts': ts, 'wx_str': noncestr, 'wx_sig': sign };
						console.log( "template var:");
						console.log( tpl_var );
    					res.render("index", tpl_var);  
				    });
			});
		});
	});
});

app.use(express.static('.'));
app.listen(port);
