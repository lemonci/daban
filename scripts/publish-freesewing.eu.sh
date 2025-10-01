#!/bin/bash

# Get current commit
echo "🔍 Grabbing current commit hash"
COMMIT=`git log --pretty=format:'%h' -n 1`
echo "#️⃣  Commit hash is $COMMIT"

# Create remote folder
echo "📂 Creating remote folder"
ssh backend.freesewing.eu mkdir -p /data/freesewing.eu/$COMMIT

# Bundle and compress build
echo "📦 Bundling and compressing data"
tar -C sites/org/build -zcf /tmp/$COMMIT.tar.gz .

# Copy build data
echo "📡 Copying data"
scp -r /tmp/$COMMIT.tar.gz backend.freesewing.eu:/data/freesewing.eu/$COMMIT/

# Unpack build data
echo "🔓 Unbundling and uncompressing data"
ssh backend.freesewing.eu "cd /data/freesewing.eu/$COMMIT && tar -xzf $COMMIT.tar.gz && rm $COMMIT.tar.gz"
