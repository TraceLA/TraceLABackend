const {Client} = require('pg');
const sq = require('./seedQuery');
const cq = require('./contactQuery');
var requestLib = require('request');
var crypto = require("crypto");
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
  client.query(cq.contactQuery, (err, res) => {
    if (err) {
        console.error(err);
        response.status(400).send("Error reseting contact DB.");
        return;
    }
    console.log('Initialized DB.');
    response.status(200).send(`Re-initialized contact DB`);
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

const userLogin = (request, response) => {
  const {username, password} = request.query;
  client.query('SELECT 1 FROM users WHERE username = $1 AND password = $2', [username,password], (error, results) => {
    if (error || results.rows.length < 1) {
      response.status(400).send("Username or password is incorrect");
      return;
    }
    var time = new Date();
    if (username in userToKey) {
      var currentKey = userToKey[username][0];
      response.status(200).json({api_key:refreshToken(username,currentKey)})
    }
    else {
      var user_key = crypto.randomBytes(20).toString('hex');
      while (user_key in keyToUser) {
        user_key = crypto.randomBytes(20).toString('hex');
      }
      keyToUser[user_key] = [username, time];
      userToKey[username] = [user_key,time];
      console.log(keyToUser)
      console.log(userToKey)
      response.status(200).json({api_key:user_key})
    }    
  })
}

const createUser = (request, response) => {
  console.log(request.headers);
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
  var api_key = request.headers['api-key'];
  const vals = [lat, long, username, api_key];

  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }
  else if (! (api_key in keyToUser)) {
    response.status(401).send("Unauthorized.");
    return;
  }
  else if (tokenExpired(api_key)) {
    response.status(401).send("Token expired.");
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
    var stamp = new Date();
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

// /*
//  * Contact Table Queries
//  */

const getContacts = (request, response) => {
  // Get contacts by username
  const { username } = request.query;
  const vals = [username];
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
  client.query('SELECT own_username, other_username, location, date FROM contacts WHERE username=$1 OR username=$2 ORDER BY date DESC', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error retrieving contacts.");
      return;
    };
    response.status(200).json(results.rows);
  });
};

// Create new contact
const createContact = (request, response) => {
  const { own_username, other_username, location, date } = request.query;
  const vals = [own_username, other_username, location, date];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  };
  client.query('INSERT INTO contacts (own_username, other_username, location, date) VALUES ($1, $2, $3, $4)', vals, (error, results) => {
    if (error) {
      response.status(400).send("Error adding contact");
      return;
    };
    response.status(200).send("Contact added");
  });
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


// first checks if users are valid
// then attempts to make a friend request 
// returns status 400 if friend request exists between 2 usernames
const friendRequest = (request, response) => {
  const { username_a, username_b } = request.query;
  const vals = [username_a, username_b, 0];
  if (vals.includes(undefined)) {
    response.status(400).send("Missing params");
    return;
  }
  client.query('SELECT 1 FROM users WHERE username = $1', [username_a], (error, results) => {
    if (error) {
      response.status(400).send("Error finding user a");
      return;
    }
    else if (results.rows.length == 0) {
      response.status(400).send("User a doesn't exist");
      return;
    }
    client.query('SELECT 1 FROM users WHERE username = $1', [username_b], (error2, results2) => {
      if (error2) {
        response.status(400).send("Error finding user b");
        return;
      }
      else if (results2.rows.length == 0) {
        response.status(400).send("User b doesn't exist");
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
    })
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
  getUserByUsername,
  createUser,
  userLogin,
  deleteUserByUsername,
  getCoords,
  getCoordsByUsername,
  createCoords,
  getFriendsByUsername,
  getContacts,
  createContact,
  getResults,
  createResult,
  friendRequest,
  confirmRequest,
  resetDB,
}

