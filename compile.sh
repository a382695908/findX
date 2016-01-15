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
	tsc --listFiles --noEmitOnError --removeComments --outDir ./bin-debug/
	if [ -d ./bin-debug/src ];then
    	cp -f ./bin-debug/src/* ./bin-debug/
    	cd bin-debug 
    	rm -rf src
	else
		echo "Not found ./bin-debug/src"
	fi
elif [ $# -eq 1 ];then
	tsc --diagnostics --listFiles --noEmitOnError --removeComments --outDir ./bin-debug/
	if [ -d ./bin-debug/src ];then
    	cp -f ./bin-debug/src/* ./bin-debug/
    	cd bin-debug 
    	rm -rf src
	else
		echo "Not found ./bin-debug/src"
	fi
else
	echo -e "\n$0 [f]\n"
fi
