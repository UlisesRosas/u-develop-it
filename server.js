const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// function that starts server. Must be at the bottom
// sinceits a catch all make sure that this function stays near the bottom  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });