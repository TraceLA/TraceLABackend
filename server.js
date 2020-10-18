const express = require('express');
const app = express();
const port = 5000;
const db = require('./queries')
const bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


// Users have either an ID or LogIn or Both, and a password
// They can use either ID or LogIn to sign into TraceLA
// [First Name, Last Name, StudentID, Username, Password]
users = {
          "user1" : {
            "First_Name" : "Adam",
            "Last_Name" : "Zegiler",
            "StudentID" : "000000001",
            "Username" : "Adam101",
            "Password" : "password"
          },
          "user2" : {
            "First_Name" : "Bob",
            "Last_Name" : "Ymir",
            "StudentID" : "000000002",
            "Username" : "Bobbystriker1032",
            "Password" : "PASSWORD"
          },
          "user3" : {
            "First_Name" : "Chelsie",
            "Last_Name" : "Xanas",
            "StudentID" : "000000003",
            "Username" : "ChickenChelsie",
            "Password" : "PassCode"
          },
          "user4" : {
            "First_Name" : "Dave",
            "Last_Name" : "Wistern",
            "StudentID" : "000000004",
            "Username" : "Daway1232",
            "Password" : "wordpass"
          },
        };

// Database stores confirmed infections
// [LogIn, Date /*DD/MM/YYYY*/, Longitude, Latitude, 
// [Place1, place 2, etc], [Person1, person2, person3]
database = {
            "contact1" : {"Username" : "Adam101",
            "Date" : "10/12/2020",
            "Longitude" : 0,
            "Latitude" : 0,
            "Locations" : ["Starbucks101"],
            "Contacts": ["Bobbystriker1032", "ChickenChelsie"],}
          };

// List of known locations for reference
locations = [
              "Starbucks101", "CookieJar13", "UCLA Dining Hall", "ASHE Student Medical Center"
            ]




app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


app.get('/users', db.getUsers)
app.get('/users/:studentid', db.getUserById)
app.post('/users', db.createUser)
app.delete('/users/:studentid', db.deleteUser)

app.get('/coords', db.getCoords)
app.get('/coords/:studentid', db.getCoordsById)
app.post('/coords', db.createCoords)