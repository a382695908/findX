#!/usr/bin/env bash
########################################################################
#    File Name: up.sh
# 
#       Author: Shootao Shanghai,Inc.
#         Mail: aceway@shootao.com
# Created Time: 2016年01月06日 星期三 18时51分47秒
#  Description: ...
# 
########################################################################
cd `dirname $0`

if [ $# -eq 0 ];then
	tsc --diagnostics --listFiles --noEmitOnError --removeComments --outDir ./bin-debug/
	if [ -d ./bin-debug/src ];then
    	cp -f ./bin-debug/src/* ./bin-debug/
    	cd bin-debug 
    	rm -rf src
	else
		echo "Not found ./bin-debug/src"
	fi
elif [ $# -eq 1 ];then
	if [ -d ./bin-debug/ ];then
        cd ./bin-debug && rm -rf * && cd ..
    fi
	tsc --diagnostics --listFiles --noEmitOnError --removeComments --outFile ./bin-debug/findX.js
	if [ -f ./bin-debug/findX.js ];then
		cd ./bin-debug
		uglifyjs ./findX.js -m -o ./findX.min.js
	else
		echo "Not found ./bin-debug/findX.js"
	fi
else
	echo -e "\n$0 [f]\n"
fi
