#!/bin/bash

# var
MANIFEST_PATH="src/manifest.json"
SOURCE_FILE_PATH="dist/"
ARCHIVE_PATH="archive/"

# get version in manifest.json
# brew install jq /sudo apt-get install jq
strVersion=$(jq -r '.version' "$MANIFEST_PATH")

# verify version 
if [ -n "$strVersion" ]; then
    # timestamp
    timestamp=$(date +"%Y%m%d%H%M%S")
    zip -r "${ARCHIVE_PATH}ela_${strVersion}_${timestamp}.zip" ${SOURCE_FILE_PATH}
else
    echo "Version is empty. Exiting."
    exit 1
fi
