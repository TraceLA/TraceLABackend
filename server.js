const express = require("express");
const app = express();
const db = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`TraceLA listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/userLogin', db.userLogin)
app.get('/users', db.getUsers)
app.post('/users', db.createUser)

app.get('/coords', db.getCoords)
app.post('/coords', db.createCoords)

app.get('/friends/', db.getFriendsByUsername)
app.post('/friendRequest', db.friendRequest)
app.post('/friendRequest/confirm', db.confirmRequest)
