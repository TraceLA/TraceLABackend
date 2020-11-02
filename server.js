const express = require("express");
const app = express();
const port = 5000;
const db = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Database stores confirmed infections
// [LogIn, Date /*DD/MM/YYYY*/, Longitude, Latitude,
// [Place1, place 2, etc], [Person1, person2, person3]
database = {
  contact1: {
    Username: "Adam101",
    Date: "10/12/2020",
    Longitude: 0,
    Latitude: 0,
    Locations: ["Starbucks101"],
    Contacts: ["Bobbystriker1032", "ChickenChelsie"],
  },
};

// List of known locations for reference
locations = [
  "Starbucks101",
  "CookieJar13",
  "UCLA Dining Hall",
  "ASHE Student Medical Center",
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", db.getUsersWithid);
app.get("/users/:studentid", db.getUserById);
app.post("/users", db.createUser);
app.delete("/users/:studentid", db.deleteUser);

app.get("/coords", db.getCoords);
app.get("/coords/:studentid", db.getCoordsById);
app.post("/coords", db.createCoords);

app.get("/friends/", db.getFriendsByEmail);
app.post("/friendRequest", db.friendRequest);
app.post("/friendRequest/confirm", db.confirmRequest);
