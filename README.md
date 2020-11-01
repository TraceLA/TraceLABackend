# Getting Started

> git clone https://github.com/TraceLA/TraceLABackend.git
> cd TraceLABackend

> touch .env

Copy-paste all the secret keys from Discord

Package.json keeps track of all your node modules. Type:
> npm install

To install a local copy of the node modules.

# Using Nodmeon
Type:
> npm run dev

To set up nodemon so you don't have to turn off and on the server for on the backend.


# Accessing the Database

> psql -U username -h nameOfRemoteServer -p 5432 dbname

# Environment Variables

Simply
> touch .env

And add the values to the environment variables like so:
```
PGHOST=[SECRET_VALUE]
PGDATABASE=[SECRET_VALUE]
PGUSER=[SECRET_VALUE]
PGPORT=[SECRET_VALUE]
PGPASSWORD=[SECRET_VALUE]
MAPQUESTKEY=[SECRET_VALUE]
```

# API Endpoints

```

app.get('/users', db.getUsers)
=> Returns all users

app.get('/users/:username', db.getUserByUsername)
=> Returns user with a given username

app.post('/users', db.createUser)
=> Create a new user with following query params:
        first_name: String,
        last_name: String,
        username: String,
        password: String,
        email: String,
        studentid: Integer

app.delete('/users/:username', db.deleteUserByUsername)
=> Deletes user with given username

app.get('/coords', db.getCoords)
=> Returns all coord rows with time stamp, username, and location tag

Optional query param:
    justLocation: "true" ; => return just latitude/longitude

app.get('/coords/:username', db.getCoordsByUsername)
=> Returns all coord rows associated with a username

app.post('/coords', db.createCoords)
=> Create a new coord row with following query params:
        lat: float,
        long: float,
        username: String
=> Calls MapQuest API to tag location street name

app.get('/friends/', db.getFriendsByUsername)
=> Returns all friends (confirmed and non-confirmed) with given username. Query params:
    username: String

app.post('/friendRequest', db.friendRequest)
=> Creates friend request with following query params:
    username_a: String,
    username_b: String

app.post('/friendRequest/confirm', db.confirmRequest)
=> Confirms friend request with following query params:
    username_a: String,
    username_b: String

app.post('/resetDB', db.resetDB)
=> Runs the seedQuery command to reset DB to initial state