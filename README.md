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
MAPQUESTKEY=[SECRET_VALUE]
```

# API Endpoints

```
app.get('/users', db.getUsers) 
=> Returns all users, sorted by student id (ascending)

app.get('/users/:studentid', db.getUserById)
=> Returns user with a given student id

app.post('/users', db.createUser)
=> Create a new user with following query params:
        First_Name: String,
        Last_Name: String,
        Username: String,
        Password: String,
        Email: String,
        StudentID: Integer

app.delete('/users/:studentid', db.deleteUser)
=> Deletes user with given student id

app.get('/coords', db.getCoords)
=> Returns all coord rows

app.get('/coords/:studentid', db.getCoordsById)
=> Returns all coord rows associated with a student id

app.post('/coords', db.createCoords)
=> Create a new coord row with following query params:
        lat: float,
        long: float,
        studentid: Integer
=> Calls MapQuest API to tag location street name

app.get('/friends/', db.getFriendsByID);
=> Returns all friends (confirmed and non-confirmed) with given email. Query params:
    email: String

app.post('/friendRequest', db.friendRequest);
=> Creates friend request with following query params:
    user_a_email: String,
    user_b_email: String

app.post('/friendRequest/confirm', db.confirmRequest);
=> Confirm friend request with following query params:
    user_a_email: String,
    user_b_email: String

```