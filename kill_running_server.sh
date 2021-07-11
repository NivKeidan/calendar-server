#!/bin/bash
set -euo pipefail
ps aux | grep node | grep -v grep | awk '{print $2}' | while read line ; do echo "killing pid $line"; sudo kill -9 $line; done
if [ 0 -ne $(ps aux | grep node | grep -v grep | wc -l) ]; then
	echo "failure! processes are alive"
	exit 1
fi

