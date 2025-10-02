#!/bin/bash

HOST=backend.freesewing.eu
SITE=freesewing.dev

# Get current commit
echo "🔍 Grabbing current commit hash"
COMMIT=`git log --pretty=format:'%h' -n 1`
echo "#️⃣  Commit hash is $COMMIT"

ARCHIVE=$SITE.$COMMIT.tar.gz

# Create remote folder
echo "📂 Creating remote folder"
ssh $HOST mkdir -p /data/$SITE/$COMMIT

# Bundle and compress build
echo "📦 Bundling and compressing data"
tar -C build -zcf /tmp/$ARCHIVE .

# Copy build data
echo "📡 Copying data"
scp -r /tmp/$ARCHIVE $HOST:/data/$SITE/$COMMIT/

# Unpack build data
echo "🔓 Unbundling and uncompressing data"
ssh $HOST "cd /data/$SITE/$COMMIT && tar -xzf $ARCHIVE && rm $ARCHIVE"

# Symlink site to live deploy
while true; do
  read -p "🚀 Do you wish to publish this build as the live freesewing.dev website? " yn
  case $yn in
      [Yy]* ) ssh backend.freesewing.eu "cd /data/freesewing.dev && ln -sf $COMMIT live"; break;;
      [Nn]* ) exit;;
      * ) echo "Please answer yes or no.";;
  esac
done


