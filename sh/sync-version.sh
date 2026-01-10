#!/bin/bash

# Sync version from src/manifest.json to package.json
MANIFEST_PATH="src/manifest.json"
PACKAGE_PATH="package.json"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install it first:"
    echo "  macOS: brew install jq"
    echo "  Linux: sudo apt-get install jq"
    exit 1
fi

# Get version from manifest.json
VERSION=$(jq -r '.version' "$MANIFEST_PATH")

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
    echo "Error: Could not read version from $MANIFEST_PATH"
    exit 1
fi

# Update version in package.json
jq --arg version "$VERSION" '.version = $version' "$PACKAGE_PATH" > "$PACKAGE_PATH.tmp" && mv "$PACKAGE_PATH.tmp" "$PACKAGE_PATH"

echo "Version synced: $VERSION (from $MANIFEST_PATH to $PACKAGE_PATH)"
