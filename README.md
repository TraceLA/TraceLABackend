# Getting Started

> git clone https://github.com/TraceLA/TraceLABackend.git

> cd TraceLABackend

> touch .env 

Copy-paste the secret keys
```
PGHOST=[SECRET_VALUE]
PGDATABASE=[SECRET_VALUE]
PGUSER=[SECRET_VALUE]
PGPORT=[SECRET_VALUE]
PGPASSWORD=[SECRET_VALUE]
MAPQUESTKEY=[SECRET_VALUE]
```

> npm install # install a local copy of the node modules.

> npm run dev # set up nodemon so you don't have to turn off and on the server for on the backend.

> psql -U username -h nameOfRemoteServer -p 5432 dbname # access the database

# API Endpoints

NOTE: All the **POST** requests require an api-key returned after a user logs in. In the authorization header, make sure you have the following: 
```
key: api-key
value: your_api_key
```

**User Login/Registration**
```
app.post('/userLogin', db.userLogin)

username: String    [REQUIRED]
password: String    [REQUIRED]

{
    "api_key": "your_api_key"
}
```

```
app.get('/users', db.getUsers)

username: String    [OPTIONAL]
first_name: String  [OPTIONAL]
last_name: String   [OPTIONAL]  
```

```
app.post('/users', db.createUser)

first_name: String  [REQUIRED]
last_name: String   [REQUIRED]
username: String    [REQUIRED]
password: String    [REQUIRED]
email: String       [REQUIRED]
studentid: Integer  [REQUIRED]
```

**Coordinates**
```
app.get('/coords', db.getCoords)

username: String        [OPTIONAL]
justLocation: "true"    [OPTIONAL]
```

```
app.post('/coords', db.createCoords)

lat: float  [REQUIRED]
long: float [REQUIRED]
```

**Friends / Friend Requests**
```
app.get('/friends/', db.getFriendsByUsername)

username: String            [REQUIRED],
confirmed: "true", "false"  [OPTIONAL] 
```

```
app.post('/friendRequest', db.friendRequest)

friend_username: String     [REQUIRED]
```

```
app.post('/friendRequest/confirm', db.confirmRequest)

friend_username: String     [REQUIRED]
reject: "true"              [OPTIONAL]
```



