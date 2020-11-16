const {Client} = require('pg');
const sq = require('./seedQuery');
const cq = require('./contactQuery');
var requestLib = require('request');
var crypto = require("crypto");
const { query } = require('express');
require('dotenv').config();

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

var keyToUser = {};
var userToKey = {};


/*
 * User POST Requests
 */

const userLogin = (request, response) => {
  const {username, password} = request.query;
  console.log(request.query);
  client.query('SELECT 1 FROM users WHERE username = $1 AND password = $2', [username,password], (error, results) => {
    if (error || results.rows.length < 1) {
      response.status(400).send("Username or password is incorrect");
    }
    else if (username in userToKey) {
      var currentKey = userToKey[username][0];
      response.status(200).json({api_key:refreshToken(username,currentKey)})
    }
    else {
      var user_key = createToken(username);
      response.status(200).json({api_key:user_key})
    }    
  })
}

const createUser = (request, response) => {
  console.log(request.query)
  const { first_name, last_name, username, password, email, studentid } = request.query;
  const vals = [first_name, last_name, username, password, email, studentid ];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
  }
  else {
    client.query('INSERT INTO users (first_name, last_name, username, password, email, studentid ) VALUES ($1, $2, $3, $4, $5, $6)', vals, (error, results) => {
      if (error) {
        response.status(400).send("Error adding user");
        return;
      }
      response.status(200).send(`User added`);
    })
  }
}



/*
 * User GET Requests
 */
const getUsers = (request, response) => {
    const { username, first_name, last_name} = request.query;
    if (username === undefined && (first_name === undefined || last_name === undefined)) {
      // Get all users
      client.query('SELECT username,first_name,last_name,email FROM users ORDER BY studentid ASC', (error, results) => {
        if (error) {
          response.status(400).send("Error retrieving users.");
        } 
        else {
          response.status(200).json(results.rows)
        }
      })
    }
    else if (username != undefined) {
      // Get user by username
      client.query('SELECT username,first_name,last_name,email FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
          response.status(400).send("Error selecting user by username");
          return;
        }
        response.status(200).json(results.rows)
      })
    }
    else {
      // Get users by first and last name
      client.query('SELECT username,first_name,last_name,email FROM users WHERE first_name=$1 AND last_name=$2', [first_name, last_name], (error, results) => {
        if (error) {
          response.status(400).send("Error selecting user");
        } 
        else {
          response.status(200).json(results.rows)
        }
      })
    }
}

// /*
//  * Coord GET Requests
//  */
const getCoords = (request, response) => {
  const {username, justLocation } = request.query;
  var queryString = "";
  if (justLocation == "true") {
    queryString = 'SELECT lat,lng FROM coords';
  }
  else {
    queryString = 'SELECT * FROM coords';
  }

  if (username != undefined) {
    queryString += " WHERE username = $1";
    client.query(queryString, [username], (error, results) => {
      if (error) {
        response.status(400).send("Error selecting coordinates by username");
      }
      else {
        response.status(200).json(results.rows)
      }
    })
  }
  else {
    client.query(queryString, (error, results) => {
      if (error) {
        response.status(400).send("Error selecting all coordinates");
      }
      else {
        response.status(200).json(results.rows)
      }
    })
  }
}

// /*
//  * Coord POST Requests
//  */
const createCoords = (request, response) => {
  const {lat, long} = request.query;
  const vals = [lat, long];

  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
  }
  else {
    var api_key = validateToken(request, response);
    if (api_key) {
      var propertiesObject = { key:process.env.MAPQUESTKEY,location: String(lat) + "," + String(long) };
      requestLib({url:'http://open.mapquestapi.com/geocoding/v1/reverse', qs:propertiesObject}, function(err, response2, body) {
        if(err) { 
          console.log(err); 
          response.status(400).send("Error in reverse coordinate lookup");
        }
        else {
          var tag = JSON.parse(response2['body'])['results'][0]['locations'][0]['street'];
          var stamp = new Date();
          var username = keyToUser[api_key][0];
          client.query('INSERT INTO coords (lat, lng, stamp, username,tag) VALUES ($1, $2, $3, $4, $5)', [lat, long, stamp, username,tag], (error, results) => {
            if (error) {
              console.log(error);
              response.status(400).send("Error inserting coordinates");
              return;
            }
            response.status(201).send(`Coord added`)
          });
        }
      });
    }
  }
}

// /*
//  * Friend GET Requests
//  */

const getFriendsByUsername = (request, response) => {
  const {username, confirmed} = request.query;
  if (username === undefined) {
    response.status(400).send("Missing username");
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

// /*
//  * Contact Table Queries
//  */

const getContacts = (request, response) => {
  // Get contacts by username
  const { username } = request.query;
  const vals = [username,username];
  if (vals.includes(undefined)) {
    client.query('SELECT own_username, other_username, location, date FROM contacts ORDER BY contact_id DESC', (error, results) => {
      if (error) {
        response.status(400).send("Error retrieving contacts.");
        return;
      }
      response.status(200).json(results.rows);
    });
    return;
  };
  
  // Get all contacts of user
  client.query('SELECT own_username, other_username, location, date FROM contacts WHERE own_username=$1 OR other_username=$2 ORDER BY date DESC', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error retrieving contacts.");
      return;
    };
    response.status(200).json(results.rows);
  });
};

// Create new contact
const createContact = (request, response) => {
  const {other_username, location, date } = request.query;
  const vals = [other_username, location, date];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  };
  var api_key = validateToken(request, response);
  if (api_key) {
    var own_username = keyToUser[api_key][0];
    client.query('INSERT INTO contacts (own_username, other_username, location, date) VALUES ($1, $2, $3, $4)', [own_username].concat(vals), (error, results) => {
      if (error) {
        response.status(400).send("Error adding contact");
        return;
      };
      response.status(200).send("Contact added");
    });
  }
  
};

// /*
//  * Test Result Table Queries
//  */
const getResults = (request, response) => {
  // Get test results by username
  const { username } = request.query;
  const vals = [username];
  if (vals.includes(undefined)) {
    client.query('SELECT username, result, date FROM test_results ORDER BY test_id DESC', (error, results) => {
      if (error) {
        response.status(400).send("Error retrieving test results.");
        return;
      }
      response.status(200).json(results.rows);
    });
    return;
  };
  
  // Get all test results of user
  client.query('SELECT username, result, date FROM test_results WHERE username=$1 ORDER BY date DESC', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error retrieving test results.");
      return;
    };
    response.status(200).json(results.rows);
  });
};

// Create new test result
const createResult = (request, response) => {
  const { username, result, date } = request.query;
  const vals = [username, result, date];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  };

  client.query('INSERT INTO test_results (username, result, date) VALUES ($1, $2, $3)', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error adding test result");
      return;
    };
    response.status(200).send("Test result added");
  });
};


// /*
//  * Friend Requests & Confirmation
//  */


// first checks if users are valid
// then attempts to make a friend request 
// returns status 400 if friend request exists between 2 usernames
const friendRequest = (request, response) => {
  const {friend_username} = request.query;
  
  if (friend_username === undefined) {
    response.status(400).send("Missing params");
  }
  else {
    var api_key = validateToken(request, response);
    if (api_key) {
      var username = keyToUser[api_key][0]
      client.query('SELECT 1 FROM users WHERE username = $1', [friend_username], (error, results) => {
        if (error || results.rows.length == 0) {
          response.status(400).send("Friend username doesn't exist");
        }
        else {
          var vals = [username, friend_username, 0];
          client.query('INSERT INTO friends (username_a, username_b, status)  VALUES ($1, $2, $3)', vals, (error2, results2) => {
            if (error2) {
              response.status(400).send("Error making friend request");
            }
            response.status(200).send(`Friend request made`);
          })
        }
      })
    }

  }
}


const confirmRequest = (request, response) => {
  const {friend_username, reject} = request.query;
  var api_key = request.headers['api-key'];
  if (friend_username === undefined) {
    response.status(400).send("Missing params");
  }
  else if (! (api_key in keyToUser)) {
    response.status(401).send("Unauthorized.");
  }
  else if (tokenExpired(api_key)) {
    response.status(401).send("Token expired.");
  }
  else {
    var username = keyToUser[api_key][0]
    var vals = [1, friend_username, username];
    if (reject == "true") {
      vals[0] = -1;
    }
    client.query('UPDATE FRIENDS SET status = $1 WHERE username_a=$2 AND username_b=$3', vals, (error, results) => {
      if (error) {
        response.status(400).send("Error confirming friend request");
      }
      else {
        response.status(200).send(`Friend request confirmed`);
      }
    })
  }
}


// /*
//  * User Authentication Helper Functions
//  */

function validateToken(request, response) {
  var api_key = request.headers['api-key'];
  if (! (api_key in keyToUser)) {
    response.status(401).send("Unauthorized.");
    return null;
  }
  else if (tokenExpired(api_key)) {
    response.status(401).send("Token expired.");
    return null;
  }
  else {
    return api_key
  }
}

function createToken(username) {
  var time = new Date();
  var user_key = crypto.randomBytes(20).toString('hex');
  while (user_key in keyToUser) {
    user_key = crypto.randomBytes(20).toString('hex');
  }
  keyToUser[user_key] = [username, time];
  userToKey[username] = [user_key,time];
  return user_key;
}

function refreshToken(username, api_key) {
  var currentKey = userToKey[username][0];
  var time = new Date();
  keyToUser[currentKey] = [username, time];
  userToKey[username] = [currentKey,time];
  return currentKey;
}

function tokenExpired(api_key) {
  var stamp = new Date();
  var minutesDiff = Math.floor( (stamp - keyToUser[api_key][1]) / 60000);
  var username = keyToUser[api_key][0];
  if (minutesDiff > 30) {
    delete userToKey[username]
    delete keyToUser[api_key]
    return true;
  }
  refreshToken(username, api_key);
  return false;
}


module.exports = {
  getUsers,
  createUser,
  userLogin,
  getCoords,
  createCoords,
  getFriendsByUsername,
  getContacts,
  createContact,
  getResults,
  createResult,
  friendRequest,
  confirmRequest,
}

