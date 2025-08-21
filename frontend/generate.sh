#!/usr/bin/env bash

npx openapi-ts -i http://localhost:46118/umbraco/swagger/delivery/swagger.json -o src/client

# fix the annoying little part that makes the types not work
sed -i '/contentType: '\''IApiContentModelBase'\'';/,+2d' ./src/client/types.gen.ts

# remove all the unnecessary files
find ./src/client ! -name "types.gen.ts" -type f -exec rm -v {} +
find ./src/client -mindepth 1 ! -name "types.gen.ts" -type d -exec rm -rf {} +

# rename to index for easy access
mv ./src/client/types.gen.ts ./src/client/index.ts
