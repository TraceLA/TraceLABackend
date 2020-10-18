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

pool.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
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
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE studentid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  

  // const query = `
// CREATE TABLE users (
//     First_Name varchar,
//     Last_Name varchar,
//     Username varchar,
//     Password varchar,
//     StudentID int
// );
// `;


  const createUser = (request, response) => {
    const { first_name, last_name, username, password, studentid } = request.query;
  
    pool.query('INSERT INTO users (first_name, last_name, username, password, studentid ) VALUES ($1, $2, $3, $4, $5)', [first_name, last_name, username, password, studentid ], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added`)
    })
  }
  
  
  module.exports = {
    getUsers,
    getUserById,
    createUser,
  }