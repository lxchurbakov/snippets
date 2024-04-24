# Plugware Fullstack oauth Github Demo

This application is only about logging in using fullstack plugware. The main plugin is authentication, which creates users as well as provides the api for logging and and utilizes that.

## Running up

First of all, you need to obtain CLIENT_ID and CLIENT_SECRET for your github application. After doing so, create `.env` file and copy the content from `.env.example` there. Insert your CLIENT_ID and CLIENT_SECRET, update JWT_SECRET to any string and run postgres via docker-compose by `npm run dc:up`.

After that you'll be able to run both fe and be with `npm run fe:dev` and `npm run be:dev`. Both will update automatically once files change. After you have finished development, drop postgres by running `npm run dc:down`.
 