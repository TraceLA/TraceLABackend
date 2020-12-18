const express = require("express");
const app = express();
const db = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");


app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/userLogin', db.userLogin)
app.get('/users', db.getUsers)
app.post('/users', db.createUser)
app.post('/userPrivacy', db.updatePrivacy)

app.get('/coords', db.getCoords)
app.post('/coords', db.createCoords)

app.get('/friends/', db.getFriendsByUsername)
app.post('/friendRequest', db.friendRequest)
app.post('/friendRequest/confirm', db.confirmRequest)

app.get('/results', db.getResults)
app.get('/aggregateResults', db.aggregateResults)
app.post('/results', db.createResult)

app.get('/contacts', db.getContacts)
app.get('/aggregateContacts', db.aggregateContacts)
app.post('/contacts', db.createContact)

app.get('/exposure/spots', db.getExposureSpots)
app.get('/exposure/contacts', db.getExposureContacts)

module.exports = app