const apiRoutes = require('./routes/apiRoutes');  
const express = require('express');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', apiRoutes);




// Not Found response for unmatched routes
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});





// // to inport the input check function
// const inputCheck = require('./utils/inputCheck');
// // required to connect mysql database
// const mysql = require('mysql2');
// const express = require('express');
// const PORT = process.env.PORT || 3001;
// const app = express();
// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// // Connect to database. 'db' stands for data base. start the server to view.
// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         // Your MySQL username,
//         user: 'root',
//         // Your MySQL password
//         password: 'password',
//         database: 'election'
//     },
//     console.log('Connected to the election database.')
// );


// // querys the database to see if we get the candidates information. combined with express route
// // Get all candidates
// app.get('/api/candidates', (req, res) => {
//     //   this query left joins the two tables
//     const sql = `SELECT candidates.*, parties.name 
//     AS party_name 
//     FROM candidates 
//     LEFT JOIN parties 
//     ON candidates.party_id = parties.id`;;

//     db.query(sql, (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// // Get a single candidate query combined with express route
// app.get('/api/candidate/:id', (req, res) => {
//     // this ? will be filled by the search in the url endpoint. QWhere clause goes at the end
//     const sql = `SELECT candidates.*, parties.name 
//     AS party_name 
//     FROM candidates 
//     LEFT JOIN parties 
//     ON candidates.party_id = parties.id 
//     WHERE candidates.id = ?`;
//     // params is an array
//     const params = [req.params.id];

//     db.query(sql, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: row
//         });
//     });
// });

// // Delete a candidate. test on post man or insomnia bc its npt a .get request so wont work in browser
// app.delete('/api/candidate/:id', (req, res) => {
//     const sql = `DELETE FROM candidates WHERE id = ?`;
//     const params = [req.params.id];

//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.statusMessage(400).json({ error: res.message });
//         } else if (!result.affectedRows) {
//             res.json({
//                 message: 'Candidate not found'
//             });
//         } else {
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });

// // Create a candidate
// // the object body is being deconstructed to check each property of the body
// app.post('/api/candidate', ({ body }, res) => {
//     // inputcheck was already provided and is used to validate user data
//     const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
//     // the deconstructed props are being checked for errors
//     if (errors) {
//         res.status(400).json({ error: errors });
//         return;
//     }
//     const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
//   VALUES (?,?,?)`;
//     const params = [body.first_name, body.last_name, body.industry_connected];

//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: body
//         });
//     });
// });



// // update a candidate's party
// app.put('/api/candidate/:id', (req, res) => {
//     const errors = inputCheck(req.body, 'party_id');

//     if (errors) {
//         res.status(400).json({ error: errors });
//         return;
//     }
//     const sql = `UPDATE candidates SET party_id = ? 
//                  WHERE id = ?`;
//     const params = [req.body.party_id, req.params.id];
//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             // check if a record was found
//         } else if (!result.affectedRows) {
//             res.json({
//                 message: 'Candidate not found'
//             });
//         } else {
//             res.json({
//                 message: 'success',
//                 data: req.body,
//                 changes: result.affectedRows
//             });
//         }
//     });
// });


// // displays all parties
// app.get('/api/parties', (req, res) => {
//     const sql = `SELECT * FROM parties`;
//     db.query(sql, (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// //  route displays single party
// app.get('/api/party/:id', (req, res) => {
//     const sql = `SELECT * FROM parties WHERE id = ?`;
//     const params = [req.params.id];
//     db.query(sql, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: row
//         });
//     });
// });

// //   route to delelete from row parties and we use delete indstead of get
// app.delete('/api/party/:id', (req, res) => {
//     const sql = `DELETE FROM parties WHERE id = ?`;
//     const params = [req.params.id];
//     // cannot display row in this case because we delete it but it can display results of the deletion
//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.status(400).json({ error: res.message });
//             // checks if anything was deleted
//         } else if (!result.affectedRows) {
//             res.json({
//                 message: 'Party not found'
//             });
//         } else {
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });

// //   displayes all of parties table
// app.get('/api/parties', (req, res) => {
//     const sql = `SELECT * FROM parties`;
//     db.query(sql, (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// //   Displayes individusl party trough ID
// app.get('/api/party/:id', (req, res) => {
//     const sql = `SELECT * FROM parties WHERE id = ?`;
//     const params = [req.params.id];
//     db.query(sql, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: row
//         });
//     });
// });

// //   deletes a party from the table
// app.delete('/api/party/:id', (req, res) => {
//     const sql = `DELETE FROM parties WHERE id = ?`;
//     const params = [req.params.id];
//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.status(400).json({ error: res.message });
//             // checks if anything was deleted
//         } else if (!result.affectedRows) {
//             res.json({
//                 message: 'Party not found'
//             });
//         } else {
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });


// // Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
// });

// // function that starts server. Must be at the bottom
// // sinceits a catch all make sure that this function stays near the bottom  
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });