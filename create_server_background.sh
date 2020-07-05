#!/bin/bash
set -euo pipefail
npm install
nohup sudo node src/server.js > /dev/null 2>&1 & 

