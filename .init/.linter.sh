#!/bin/bash
cd /home/kavia/workspace/code-generation/trip-tracker-interface-129281-129346/trip_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

