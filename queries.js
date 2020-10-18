const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})


const query = `
CREATE TABLE users (
    First_Name varchar,
    Last_Name varchar,
    Username varchar,
    Password varchar,
    StudentID int
);
`;

const query2 = `
CREATE TABLE coords (
    lat float8,
    long float8,
    stamp TIMESTAMPTZ,
    studentid int
);
`;


pool.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
});


pool.query(query2, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Coords Table is successfully created');
});


const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY studentid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.studentid)
    console.log(id);
    pool.query('SELECT * FROM users WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createUser = (request, response) => {
    const { first_name, last_name, username, password, studentid } = request.query;
    console.log(request.query);
    pool.query('INSERT INTO users (first_name, last_name, username, password, studentid ) VALUES ($1, $2, $3, $4, $5)', [first_name, last_name, username, password, studentid ], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added`)
    })
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.studentid)
  
    pool.query('DELETE FROM users WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }


  const getCoords = (request, response) => {
    pool.query('SELECT * FROM coords ORDER BY studentid ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


  const getCoordsById = (request, response) => {
    const id = parseInt(request.params.studentid)
    console.log(id);
    pool.query('SELECT * FROM coords WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createCoords = (request, response) => {
    const {  lat, long, studentid } = request.query;
    var stamp = new Date()
    pool.query('INSERT INTO coords (lat, long, stamp, studentid ) VALUES ($1, $2, $3, $4)', [lat, long, stamp, studentid], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Coord added`)
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
  }