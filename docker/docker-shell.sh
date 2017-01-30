#!/usr/bin/env bash

TEST_MODE=test
DEBUGTEST_MODE=debugtest
JENKINSBUILD_MODE=jenkinsbuild
MODE=$TEST_MODE

#parse argument list
while [[ $# > 0 ]]
do
	ARG=$1

	case $ARG in
	-t|--test) MODE=$TEST_MODE ;;
	-dt|--debugtest) MODE=$DEBUGTEST_MODE ;;
	-j|--jenkintest) MODE=$JENKINSBUILD_MODE ;;
	esac

	shift
done

#set pwd
cd /opt/app/current

#echo out environment variables we care about
echo APPLICATION_VARIABLES
echo NODE_ENV=$NODE_ENV

#execution based on argument
if [ $MODE == $TEST_MODE ]; then
	echo RUNNING TEST
	make test
elif [ $MODE == $DEBUGTEST_MODE ]; then
	echo RUNNING DEBUG BUILD
	make debug-test
elif [ $MODE == $JENKINSBUILD_MODE ]; then
	echo RUNNING JENKINS BUILD
	make jenkins-build
fi
