#!/usr/bin/env bash

set -e

#np $1

function printVersion() {
    cat ./package.json | grep "\"version\":" | cut -d':' -f2 | cut -d'"' -f2
}

version=$(printVersion)

pushd types

typesVersion=$(printVersion)

sed -i '' "s/\"version\": \"${typesVersion}\"/\"version\": \"${version}\"/" package.json

npm publish

popd

