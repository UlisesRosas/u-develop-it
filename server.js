// required to connect mysql database
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database. 'db' stands for data base. start the server to view.
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'password',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );


// querys the database to see if we get the candidates information
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
//   });

// GET a single candidate query. Read functionality 
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if (err) {
      console.log(err);
    }
    console.log(row);
  });

// Delete a candidate query. we use 'result' instead of row in the params. we use result for any query making changes
// the ? ia s place holder for any value in this case the 1 but can enter multiple values to repete the query on multiple IDs
// this '?' place holder can also protect the database from an injection attack
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });


// Create a candidate query.
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

  // function that starts server. Must be at the bottom
// sinceits a catch all make sure that this function stays near the bottom  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });