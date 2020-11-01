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


/*
 * Reset Table Queries
 */

const resetDB= (request, response) => {
  client.query(sq.seedQuery, (err, res) => {
    if (err) {
        console.error(err);
        response.status(400).send("Error reseting DB.");
        return;
    }
    console.log('Initialized DB.');
    response.status(200).send(`Re-initialized DB`);
  });
}


/*
 * User Table Queries
 first_name,last_name,username,email 
 */

const getUsers = (request, response) => {
    // Get user by name
    const { first_name, last_name} = request.query;
    const vals = [first_name, last_name];
    if (vals.includes(undefined)) {
      client.query('SELECT * FROM users ORDER BY studentid ASC', (error, results) => {
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

const getUserByUsername = (request, response) => {
    const username = request.params.username
    client.query('SELECT first_name,last_name,email FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        response.status(400).send("Error selecting user by username");
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

const deleteUserByUsername = (request, response) => {
  const username = request.params.username
  client.query('DELETE FROM users WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send("Error deleting user");
      return;
    }
    response.status(200).send(`User deleted with username: ${username}`)
  })
}

// /*
//  * Coord Table Queries
//  */
const getCoords = (request, response) => {
  const {  justLocation } = request.query;
  console.log(justLocation);
  if (justLocation == "true") {
    client.query('SELECT lat,lng FROM coords', (error, results) => {
      if (error) {
        response.status(400).send("Error getting coordinates");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
  else {
    client.query('SELECT * FROM coords', (error, results) => {
      if (error) {
        response.status(400).send("Error getting coordinates");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
}


const getCoordsByUsername = (request, response) => {
  const username = request.params.username
  client.query('SELECT * FROM coords WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send("Error selecting coordinates by username");
      return;
    }
    response.status(200).json(results.rows)
  })
}

const createCoords = (request, response) => {
  const {  lat, long, username } = request.query;
  var stamp = new Date();
  const vals = [lat, long, stamp, username];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }

  var propertiesObject = { key:process.env.MAPQUESTKEY,location: String(lat) + "," + String(long) };
  requestLib({url:'http://open.mapquestapi.com/geocoding/v1/reverse', qs:propertiesObject}, function(err, response2, body) {
    if(err) { 
      console.log(err); 
      response.status(400).send("Error in reverse coordinate lookup");
      return; 
    }
    var b = JSON.parse(response2['body']);
    var tag = b['results'][0]['locations'][0]['street'];

    client.query('INSERT INTO coords (lat, lng, stamp, username,tag) VALUES ($1, $2, $3, $4, $5)', [lat, long, stamp, username,tag], (error, results) => {
      if (error) {
        console.log(error);
        response.status(400).send("Error inserting coordinates");
        return;
      }
      response.status(201).send(`Coord added`)
    });
  });
}

// /*
//  * Friend Table Queries
//  */

const getFriendsByUsername = (request, response) => {
  const {username, confirmed} = request.query;
  if (username === undefined) {
    response.status(400).send("Missing username");
    return;
  }
  else if (confirmed === undefined) {
    // show both confirmed & unconfirmed friends
    client.query('SELECT * FROM friends WHERE username_a = $1', [username], (error, results) => {
      if (error) {
        response.status(400).send("Error finding friends by username");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
  else if (confirmed == "true") {
    // show only confirmed friends
    client.query('SELECT * FROM friends WHERE username_a = $1 AND status=1', [username], (error, results) => {
      if (error) {
        response.status(400).send("Error finding confirmed friends by username");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
  else if (confirmed == "false") {
    // gets pending requests
    client.query('SELECT * FROM friends WHERE username_a = $1 AND status=0', [username], (error, results) => {
      if (error) {
        response.status(400).send("Error finding confirmed friends by username");
        return;
      }
      response.status(200).json(results.rows)
    })
  }
  else {
      response.status(400).send("Invalid parameter");
      return;
  }
}

const friendRequest = (request, response) => {
  const { username_a, username_b } = request.query;
  const vals = [username_a, username_b, 0];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }
  client.query('INSERT INTO friends (username_a, username_b, status)  VALUES ($1, $2, $3)', vals, (error, results) => {
    if (error) {
      console.log(error);
      response.status(400).send("Error making friend request");
      return;
    }
    response.status(200).send(`Friend request made`);
  })
}


const confirmRequest = (request, response) => {
  const { username_a, username_b } = request.query;
  const vals = [username_a, username_b];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }
  client.query('UPDATE FRIENDS SET status = 1 WHERE username_a=$1 AND username_b=$2', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error confirming friend request");
      return;
    }
    response.status(200).send(`Friend request confirmed`);
  })
}

module.exports = {
  getUsers,
  getUserByUsername,
  createUser,
  deleteUserByUsername,
  getCoords,
  getCoordsByUsername,
  createCoords,
  getFriendsByUsername,
  friendRequest,
  confirmRequest,
  resetDB,
}

