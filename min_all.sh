#!/usr/bin/env bash
########################################################################
#    File Name: min_all.sh
# 
#       Author: 艾维
#         Mail: aceway@qq.com
# Created Time: Tue 19 Jan 2016 04:18:25 PM CST
#  Description: ...
# 
########################################################################

cd `dirname $0`
if [ -d ./bin-debug ];then
    cd ./bin-debug
    
    if [ -f ./CreateBaseEnv.js ];then
        uglifyjs ./CreateBaseEnv.js -m -o ./CreateBaseEnv.min.js
        rm -f ./CreateBaseEnv.js
    fi
    
    if [ -f ./CreateGame.js ];then
        uglifyjs ./CreateGame.js -m -o ./CreateGame.min.js
        rm -f ./CreateGame.js
    fi
    
    if [ -f ./ExtraE3D.js ];then
        uglifyjs ./ExtraE3D.js -m -o ./ExtraE3D.min.js
        rm -f ./ExtraE3D.js
    fi
    
    if [ -f ./FindXDataDriver.js ];then
        uglifyjs ./FindXDataDriver.js -m -o ./FindXDataDriver.min.js
        rm -f ./FindXDataDriver.js
    fi
    
    if [ -f ./GameDataDriver.js ];then
        uglifyjs ./GameDataDriver.js -m -o ./GameDataDriver.min.js
        rm -f ./GameDataDriver.js
    fi
    
    if [ -f ./Main.js ];then
        uglifyjs ./Main.js -m -o ./Main.min.js
        rm -f ./Main.js
    fi
fi
