const {Client} = require('pg')

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

const seedQuery = `
DROP TABLE users; 
DROP TABLE coords;

CREATE TABLE users (
    First_Name    varchar     NOT NULL,
    Last_Name     varchar     NOT NULL,
    Username      varchar     NOT NULL,
    Password      varchar     NOT NULL,
    Email         varchar     NOT NULL,
    StudentID     int         NOT NULL    PRIMARY KEY
);

CREATE TABLE coords (
  lat float8          NOT NULL,
  long float8         NOT NULL,
  stamp TIMESTAMPTZ,
  studentid int       NOT NULL
);

INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
        VALUES ('Carey','Nachenberg','caring', 'nachobird', 'cnachoberg@ucla.edu', 987654321);
INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
        VALUES ('David','Smallberg','small', 'berggg', 'smallberg@ucla.edu', 123456789);
`;


client.query(seedQuery, (err, res) => {
  if (err) {
      console.error(err);
      return;
  }
  console.log('Initialized DB.');
});


const getUsers = (request, response) => {
  client.query('SELECT * FROM users ORDER BY studentid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.studentid)
    console.log(id);
    client.query('SELECT * FROM users WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        throw error
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
    throw error
  }
  response.status(200).send(`User added`);
})
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.studentid)

  client.query('DELETE FROM users WHERE studentid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}


const getCoords = (request, response) => {
  client.query('SELECT * FROM coords ORDER BY studentid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getCoordsById = (request, response) => {
  const id = parseInt(request.params.studentid)
  console.log(id);
  client.query('SELECT * FROM coords WHERE studentid = $1', [id], (error, results) => {
    if (error) {
      throw error
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
  client.query('INSERT INTO coords (lat, long, stamp, studentid ) VALUES ($1, $2, $3, $4)', [lat, long, stamp, studentid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Coord added`)
    });
}



module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  getCoords,
  getCoordsById,
  createCoords,
}