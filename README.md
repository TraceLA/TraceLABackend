# Getting Started
Package.json keeps track of all your node modules. Type:
> npm install

To install a local copy of the node modules.

# Using Nodmeon
Type:
> npm run dev

To set up nodemon so you don't have to turn off and on the server for on the backend.

# Environment Variables

Collaborators have access to the environment variables under Settings/Secrets. 

Simply
> touch .env

And add the values to the environment variables like so:
```
PGHOST=[SECRET_VALUE]
PGDATABASE=[SECRET_VALUE]
PGUSER=[SECRET_VALUE]
PGPORT=[SECRET_VALUE]
PGPASSWORD=[SECRET_VALUE]
```