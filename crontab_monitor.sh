#!/usr/bin/env bash

term_info=${TERM:-"dumb"}

if [ -z ${term_info} ] || [ "${term_info}" = "dumb" ];then
    RED=""
    GREEN=""
    BLUE=""
    YELLOW=""
    GRAY=""
    LIGHT_RED=""
    LIGHT_YELLOW=""
    LIGHT_GREEN=""
    LIGHT_BLUE=""
    LIGHT_GRAY=""
    END=""
else
    RED="\033[0;31m"
    GREEN="\033[0;32m"
    BLUE="\033[0;34m"
    YELLOW="\033[0;33m"
    GRAY="\033[0;37m"
    LIGHT_RED="\033[1;31m"
    LIGHT_YELLOW="\033[1;33m"
    LIGHT_GREEN="\033[1;32m"
    LIGHT_BLUE="\033[0;34m"
    LIGHT_GRAY="\033[1;37m"
    END="\033[0;00m"
fi

function start() 
{
    if [ ! -d "../log" ];then
        mkdir ../log
    fi  
    echo -e "${GREEN} ${pname} ${script} starting...${END}"
    pcount=`ps -ef | grep -w ${LOGNAME} | grep "\<${pname}\>" | grep "\<${script}\>"  |grep -v "grep"|wc -l`
    if [ `expr ${pcount}` -gt 0 ]; then
        echo -e "${YELLOW}有 ${LIGHT_RED}${pname} ${script} ${YELLOW}正在运行中，请检查。${END}\n"
    else
        if [ -z ${term_info} ] || [ "${term_info}" = "dumb" ];then
            ${pname} ./${script} > /dev/null  
        else
            ${pname} ./${script}
        fi
    fi
}

function stop()
{
    pcount=`ps -ef | grep -w ${LOGNAME} | grep "\<${pname}\>" | grep "\<${script}\>" |grep -v "grep"|wc -l`
    if [ `expr ${pcount}` -gt 0 ]; then
        ps -ef | grep -w ${LOGNAME} | grep "\<${pname}\>" | grep "\<${script}\>"  | grep -v "grep" | awk '{print "kill " $2}'| bash     #server bench 服务器带后缀 -MAIN
        echo -e ${RED}"\tkill ${pname} ${script}..."${END}
    else
        echo -e ${YELLOW}"\t${pname}  ${script}没有运行"${END}
    fi
}

function stat()
{
    pcount=`ps -ef | grep -w ${LOGNAME} | grep "\<${pname}\>" | grep "\<${script}\>" |grep -v "grep"|wc -l`
    echo -e "${YELLOW}[${pname}]${END} - ${GREEN} 进程数: ${LIGHT_RED}${pcount}${END}"
    ps -ef |grep -w ${LOGNAME} | grep "\<${pname}\>" | grep "\<${script}\>" |grep -v "grep"
}

function help()
{
    echo -e "Usage:\n\t${LIGHT_GREEN}crontab_monitor.sh ${YELLOW}start|stop|restart|stat${END}"
}

function restart()
{
    stop $1
    start $1
}

function program_ctrl()
{
    cmd=$1
    echo
    if [ "${cmd}" = "stop" ] ; then
        stop
    elif [ "${cmd}" = "start" ]; then
        start
    elif [ "${cmd}" = "stat" ]; then
        stat
    elif [ "${cmd}" = "restart" ]; then
        restart
    elif [ "${cmd}" = "--help" ] || [ "$cmd" = "-h" ]; then
        help
    else
        help
    fi
}


#更换程序只需要更换下面两个值
pname="node"
script="webserver.js"

cd `dirname $0`
the_cmd=$1

program_ctrl ${the_cmd}
