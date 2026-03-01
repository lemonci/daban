#!/bin/bash
#
# A little helper file that you can source in your scripts
# to get access to a bunch of configuration values.
#
# This provides the following variables:
#
#   - FREESEWING_GIT_ROOT
#   - FREESEWING_GIT_REPO
#   - FREESEWING_GIT_REPO_URL
#   - FREESEWING_VERSION
#   - FREESEWING_VERSION_TAG
#

#
# Location of the git repo on disk
#
FREESEWING_GIT_ROOT=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && cd .. && pwd )

#
# Git repository
#
FREESEWING_GIT_REPO="freesewing/freesewing"
FREESEWING_GIT_REPO_URL="https://codeberg.org/freesewing/freesewing"

#
# Current FreeSewing version
#
FREESEWING_VERSION=$(<$FREESEWING_GIT_ROOT/VERSION)

#
# Current FreeSewing version tag
#
FREESEWING_VERSION_TAG="v$FREESEWING_VERSION"

