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
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
  });


// function that starts server. Must be at the bottom
// sinceits a catch all make sure that this function stays near the bottom  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });