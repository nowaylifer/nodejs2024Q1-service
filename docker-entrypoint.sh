#!/bin/sh

set -e

cd /app/

npm run migrate:dev
npm run prisma:seed
npm run start:dev