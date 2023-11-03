#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for db:5432 

echo "Migrating the databse..."
npm run db:latest

echo "Starting the server..."
npm run dev 