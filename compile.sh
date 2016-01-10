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
    tsc
    if [ $? -eq 0 ];then
        mv ./bin-debug/src/* ./bin-debug/
        cd bin-debug
        rm -rf src
    fi
else
    echo -e "\n$0 \n"
fi

