const {Client} = require('pg')
const sq = require('./seedQuery')
var requestLib = require('request');
require('dotenv').config()

const client = new Client({
  host:process.env.PGHOST,
  port:process.env.PGPORT,
  user:process.env.PGUSER,
  database:process.env.PGDATABASE,
  password:process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();


client.query(sq.seedQuery, (err, res) => {
  if (err) {
      console.error(err);
      return;
  }
  console.log('Initialized DB.');
});


/*
 * User Table Queries
 */

const getUsers = (request, response) => {

    // Get user by name
    const { first_name, last_name} = request.query;
    const vals = [first_name, last_name];
    if (vals.includes(undefined)) {
      client.query('SELECT first_name,last_name,email FROM users ORDER BY studentid ASC', (error, results) => {
        if (error) {
          response.status(400).send("Error retrieving users.");
          return;
        }
        response.status(200).json(results.rows)
      })
      return;
    }
    
    // Get all users
    client.query('SELECT first_name,last_name,email FROM users WHERE first_name=$1 AND last_name=$2', vals, (error, results) => {
      if (error) {
        response.status(400).send("Error adding user");
        return;
      }
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.studentid)
    console.log(id);
    client.query('SELECT first_name,last_name,email FROM users WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send("Error selecting user by id");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
  
const createUser = (request, response) => {
  const { first_name, last_name, username, password, email, studentid } = request.query;
  const vals = [first_name, last_name, username, password, email, studentid ];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }

  client.query('INSERT INTO users (first_name, last_name, username, password, email, studentid ) VALUES ($1, $2, $3, $4, $5, $6)', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error adding user");
      return;
    }
    response.status(200).send(`User added`);
  })
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.studentid)

  client.query('DELETE FROM users WHERE studentid = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send("Error deleting user");
      return;
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

/*
 * Coord Table Queries
 */
const getCoords = (request, response) => {
  client.query('SELECT * FROM coords ORDER BY studentid ASC', (error, results) => {
    if (error) {
      response.status(400).send("Error getting coordinates");
      return;
    }
    response.status(200).json(results.rows)
  })
}


const getCoordsById = (request, response) => {
  const id = parseInt(request.params.studentid)
  console.log(id);
  client.query('SELECT * FROM coords WHERE studentid = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send("Error selecting coordinates by student id");
      return;
    }
    response.status(200).json(results.rows)
  })
}

const createCoords = (request, response) => {
  const {  lat, long, studentid } = request.query;
  var stamp = new Date();
  const vals = [lat, long, stamp, studentid];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }

  var propertiesObject = { key:process.env.MAPQUESTKEY,location: String(lat) + "," + String(long) };
  requestLib({url:'http://open.mapquestapi.com/geocoding/v1/reverse', qs:propertiesObject}, function(err, response2, body) {
    if(err) { console.log(err); return; }
    var b = JSON.parse(response2['body']);
    var tag = b['results'][0]['locations'][0]['street'];

    client.query('INSERT INTO coords (lat, long, stamp, studentid,tag) VALUES ($1, $2, $3, $4, $5)', [lat, long, stamp, studentid,tag], (error, results) => {
      if (error) {
        response.status(400).send("Error inserting coordinates");
        return;
      }
      response.status(201).send(`Coord added`)
    });
  });

  
}

/*
 * Friend Table Queries
 */

const getFriendsByID = (request, response) => {
  const id = parseInt(request.params.studentid)
  client.query('SELECT * FROM friends WHERE user_a = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send("Error finding friends by id");
      return;
    }
    response.status(200).json(results.rows)
  })
}

const friendRequest = (request, response) => {
  const { user_a, user_b } = request.query;
  const vals = [user_a, user_b, 0];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }

  client.query('INSERT INTO friends (user_a,user_b,status)  VALUES ($1, $2, $3)', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error adding user");
      return;
    }
    response.status(200).send(`User added`);
  })
}

const confirmRequest = (request, response) => {
  const { user_a, user_b } = request.query;
  const vals = [user_a, user_b];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }

  client.query('UPDATE FRIENDS SET status = 1 WHERE user_a=$1 AND user_b=$2', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error confirming friend request");
      return;
    }
    response.status(200).send(`Friend request confirmed`);
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  getCoords,
  getCoordsById,
  createCoords,
  getFriendsByID,
  friendRequest,
  confirmRequest,
}