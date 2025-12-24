mkdir event-planner
cd event-planner
npm init -y
npm install express body-parser

erver.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'mainpage.html'));
});

app.post('/register', (req, res) => {
const formData = req.body;
console.log('Received Registration:', formData);

res.send( <h2>Thanks ${formData.name}, your event has been registered!</h2> <p><a href="/">Go Back</a></p> );
});

// Start server
app.listen(PORT, () => {
console.log(Server running at http://localhost:${PORT});
});

mkdir public
Move: mainpage.html, p2.html, p3.html, p4.html, usr.html, usr1.html, bservice1.html, bservice2.html → into public/

Step 4: Update Form HTMLs (example for bservice2.html)

In bservice2.html or any page with forms, change:

<form action="evenRegister.php" method="post">
to:

<form action="/register" method="post">
Repeat this for all form pages.

Step 5: Run Your Server

In terminal:

node server.js

Visit: http://localhost:3000