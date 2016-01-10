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

if [ $# -eq 1 ];then
    if [ $1 = "o" ] || [ $1 = "official" ];then
        echo -e "Copy from official egret github"
        cp ~/workspace/egret/egret-3d/Sample-wing/egret3d.js ./
        cp ~/workspace/egret/egret-3d/Sample-wing/egret3d.js ./src
        cp ~/workspace/egret/egret-3d/Sample-wing/src/egret3d.d.ts ./src
    elif [ $1 = "1" ] || [ $1 = "egret3d_1" ];then
        echo -e "Copy from egret3d_1(QQ friend) github"
        cp ~/bak/egret3d_1/Sample-wing/egret3d.js ./
        cp ~/bak/egret3d_1/Sample-wing/egret3d.js ./src
        cp ~/bak/egret3d_1/Sample-wing/egret3d.d.ts ./src
    elif [ $1 = "m" ] || [ $1 = "my" ] || [ $1 = "mine" ];then
        echo -e "Copy from my egret github"
        cp ~/workspace/git/github/egret-3d/Sample/egret3d.js ./
        cp ~/workspace/git/github/egret-3d/Sample/egret3d.js ./src
        cp ~/workspace/git/github/egret-3d/Sample/egret3d.d.ts ./src
    else
        echo -e "\n$0 [ o | 1 | m ]\n"
    fi
else
    echo -e "\n$0 [ o | 1 | m ]\n"
fi

