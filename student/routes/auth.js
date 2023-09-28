const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

// Authenticate user and create JWT token
router.post('/login', (req, res) => {
  // Authenticate user (you can use your own logic here)
  const username = req.body.username;
  const password = req.body.password;

  // Example: Check username and password
  if (username === 'admin' && password === 'password') {
    // User is authenticated; create a JWT token
    const token = jwt.sign({ username }, 'your-jwt-secret', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Store the token in a session
    req.session.token = token;
    req.session.user = { username };

    res.redirect('/students');
  } else {
    res.redirect('/login');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
