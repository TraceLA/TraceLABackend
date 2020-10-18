const express = require('express');
const app = express();
const port = 5000;

// Users have either an ID or LogIn or Both, and a password
// [First Name, Lastname, Student ID, LogIn, Password]
users = [
          ["Adam","Zegiler", "123456789" "Adam101", "password"],
          ["Bob", "Ymir", "123456798", "Bobbystriker1032", "PASSWORD"],
          ["Chelsie", "Xanas", "123456879", "ChickenChelsie", "PassCode"]
        ];

// Database stores confirmed infections
// [LogIn, Date /*DD/MM/YYYY*/, Longitude, Latitude, 
// [Place1, place 2, etc], [Person1, person2, person3]
database = [
            ["Adam101", "10/12/2020", 0, 0, ["Starbucks101"], ["Bobbystriker1032", "ChickenChelsie"]],
          ];

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});