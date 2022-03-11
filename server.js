// to inport the input check function
const inputCheck = require('./utils/inputCheck');
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


// querys the database to see if we get the candidates information. combined with express route
// Get all candidates
app.get('/api/candidates', (req, res) => {
//   this query left joins the two tables
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get a single candidate query combined with express route
app.get('/api/candidate/:id', (req, res) => {
    // this ? will be filled by the search in the url endpoint. QWhere clause goes at the end
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
;
    // params is an array
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate. test on post man or insomnia bc its npt a .get request so wont work in browser
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
// the object body is being deconstructed to check each property of the body
app.post('/api/candidate', ({ body }, res) => {
    // inputcheck was already provided and is used to validate user data
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    // the deconstructed props are being checked for errors
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
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
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// function that starts server. Must be at the bottom
// sinceits a catch all make sure that this function stays near the bottom  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});