const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 9000;

// Connect to Redis
const redisClient = redis.createClient({
  host: 'localhost', // Replace with your Redis server host
  port: 6379, // Replace with your Redis server port
});

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/user_register', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up session middleware with Redis store
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/redis_login');
};

// Routes
app.get('/', isAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.session.user.username}! <a href="/logout">Logout</a>`);
});

app.get('/redis_login', (req, res) => {
  res.sendFile(__dirname + '/redis_login.html');
});

app.post('/redis_login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      res.redirect('/redis_login');
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/redis_login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/redis_login');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
