#!/usr/bin/env bash

set -e

np $1

version=`grep version package.json | cut -c 15- | rev | cut -c 3- | rev`

pushd interfaces

interfaces_version=`grep version package.json | cut -c 15- | rev | cut -c 3- | rev`

sed -i '' "s/\"version\": \"{$interfaces_version}\"/\"version\": \"${version}\"/" package.json

npm publish

popd

pushd types

types_version=`grep version package.json | cut -c 15- | rev | cut -c 3- | rev`

sed -i '' "s/\"version\": \"{$types_version}\"/\"version\": \"${version}\"/" package.json

npm publish

popd
