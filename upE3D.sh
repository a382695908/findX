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
        echo -e "Copy from official egret [~/workspace/egret/egret-3d/Egret3D] github"
        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.js ./libs/modules/egret/
        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.d.ts ./libs/modules/egret/
    elif [ $1 = "m" ] || [ $1 = "my" ] || [ $1 = "mine" ];then
        echo -e "Copy from my egret [~/workspace/git/github/egret-3d/Egret3D] github"
        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.js ./libs/modules/egret/
        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.d.ts ./libs/modules/egret/
    else
        echo -e "\n$0 [ o | m ]\n"
		exit 0
    fi
    cd ./libs/modules/egret/
	uglifyjs ./egret3d.js -m -o ./egret3d.min.js
else
    echo -e "\n$0 [ o | m ]\n"
fi

