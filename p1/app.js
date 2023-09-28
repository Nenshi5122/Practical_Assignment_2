const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up mongoose and connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/user_register', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Define user schema and model
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String, // Corrected field name
  pic: String,
});
const User = mongoose.model('User', userSchema);

// Set up Express routes
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', upload.single('pic'), async (req, res) => {
  try {
    const { fname, lname, email, username, password } = req.body;
    const pic = req.file.filename;

    const newUser = new User({ fname, lname, email, username, password, pic });
    await newUser.save();

    res.send('User registered successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
