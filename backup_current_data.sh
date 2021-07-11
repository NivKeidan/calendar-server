#!/bin/bash
set -euo pipefail

cp -avr /home/ubuntu/calendar-server/entries.json /home/ubuntu/entries-bkp-$(date +"%s").json
