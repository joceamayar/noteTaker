const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const { readAndAppend } = require('./helpers/fsUtils');
const PORT = process.env.PORT || 3001;

//const readFile = util.promisify(fs.readFile);
const app = express();
// Middleware for parsing JSON and url encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

//Returns notes.html when click on Get Started
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//Returns`index.html` file.

app.get('index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// / Gets /api/notes, read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {

  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);

      // sending it back to the front end 
      res.json(parsedData)
    }
  })

});

// POST request to add a note
app.post('/api/notes', (req, res) => {

  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {

    // Variable for the object we will save
    const newNote = {
      id: uuid(),
      title,
      text
    };

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote);
    console.info(`Got note: ${noteString}`);

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});



//Under construction
// app.delete('/api/notes', (req, res) => {
// * `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
// });


//Start server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);



