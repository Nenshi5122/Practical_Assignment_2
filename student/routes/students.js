const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// List all students
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('students', { students });
});

// Display student creation form
router.get('/create', (req, res) => {
  res.render('student_form');
});

// Create a new student
router.post('/create', async (req, res) => {
  const { name, age } = req.body;
  const student = new Student({ name, age });
  await student.save();
  res.redirect('/students');
});

// Display student details
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('student_detail', { student });
});

// Edit student details (display edit form)
router.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('student_edit', { student });
});

// Update student details
router.put('/:id', async (req, res) => {
  const { name, age } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age });
  res.redirect('/students/' + req.params.id);
});

// Delete a student
router.get('/delete/:id', async (req, res) => {
  await Student.findByIdAndRemove(req.params.id);
  res.redirect('/students');
});

module.exports = router;
