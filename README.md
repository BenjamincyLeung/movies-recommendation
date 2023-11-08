# movies-recommendation
A simple web app for viewing movies built by Nextjs. An additional Python application providing movie recommendation service using a machine learning algorithm.

# How to start

## Build the docker
`docker-compose -f docker-compose.dev.yml build`

## Up the docker
`docker-compose -f docker-compose.dev.yml up`

# The environment variable
Since all the environments are in the docker-compose.dev.yml file, it is recommended to use docker for starting the application.
There are a few credentials information as environment variables that are required in env. Please execute `mv .env.sample .env`.

# Seeding data
Since the machine learning part needs a bunch of data, you must seed the films, users, and rating data into the psql. 
This will be automatically executed when starting the docker. But it will take a few seconds for seeding that data.
Since the rating data size is too large to upload to Github. So I put it in an Amazon S3 bucket. You just register an AWS account
and put the key and secret in the env file. Otherwise, you will not have a rating database.

# URL

## development web URL
http://localhost:3000

## Nextjs api URL 
http://localhost:3000/api

## Flask api URL
http://localhos:5001/api
