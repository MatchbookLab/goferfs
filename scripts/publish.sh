#!/usr/bin/env bash

set -e

function printVersion() {
    cat ./package.json | grep "\"version\":" | cut -d':' -f2 | cut -d'"' -f2
}

np $1

version=$(printVersion)

pushd interfaces

interfacesVersion=$(printVersion)

sed -i '' "s/\"version\": \"${interfacesVersion}\"/\"version\": \"${version}\"/" package.json

npm publish

popd

pushd types

typesVersion=$(printVersion)

sed -i '' "s/\"version\": \"${typesVersion}\"/\"version\": \"${version}\"/" package.json

npm publish

popd
