const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');
const Student = require('./models/student');
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://0.0.0.0:27017/student_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride('_method')); // Method override for PUT and DELETE requests

// Set up the template engine (EJS)
app.set('view engine', 'ejs');
app.set('views', 'views');

// JWT Secret Key
const jwtSecret = 'your-jwt-secret';

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

app.get('/login', (req, res) => {
  // Render the login page here
  res.render('login');
});

app.use('/auth', authRoutes);
app.use('/students', isAuthenticated, studentsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
