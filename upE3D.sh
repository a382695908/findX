#!/usr/bin/env bash
########################################################################
#    File Name: up.sh
# 
#       Author: aceway
#         Mail: aceway@qq.com
# Created Time: 2016年01月06日 星期三 18时51分47秒
#  Description: ...
# 
########################################################################
cd `dirname $0`

if [ $# -eq 1 ];then
    if [ $1 = "o" ] || [ $1 = "official" ];then
        echo -e "Copy from official egret [~/workspace/egret/egret-3d/Egret3D] github"
        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.d.ts ./egret3d/src/
        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.js ./egret3d/src/

        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.d.ts ./egret3d/bin/egret3d/
        cp ~/workspace/egret/egret-3d/Egret3D/egret3d.js ./egret3d/bin/egret3d/
    elif [ $1 = "m" ] || [ $1 = "my" ] || [ $1 = "mine" ];then
        echo -e "Copy from my egret [~/workspace/git/github/egret-3d/Egret3D] github"
        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.d.ts ./egret3d/src/ 
        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.js  ./egret3d/src/

        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.d.ts ./egret3d/bin/egret3d/ 
        cp ~/workspace/git/github/egret-3d/Egret3D/egret3d.js ./egret3d/bin/egret3d/
    else
        echo -e "\n$0 [ o | m ]\n"
		exit 0
    fi
	pushd $PWD > /dev/null
    cd ./egret3d/src/
	uglifyjs ./egret3d.js -m -o ./egret3d.min.js
	popd > /dev/null

	pushd $PWD > /dev/null
    cd ./egret3d/bin/egret3d/
	uglifyjs ./egret3d.js -m -o ./egret3d.min.js
	popd 1  > /dev/null
else
    echo -e "\n$0 [ o | m ]\n"
fi

