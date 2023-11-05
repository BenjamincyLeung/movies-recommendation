#!/bin/sh

echo "Waiting for Postgres to start..."
./wait-for db:5432 

echo "Migrating the databse..."
npm run db:latest

echo "Seed data..."
npm run data-init

echo "Starting the server..."
npm run dev 