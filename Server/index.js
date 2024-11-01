const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const User = require('./models/User');
const Project = require('./models/Project');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authenticateToken')

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log("Error : ", e);
  })
  

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.send("hello");
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id) // Populate the projects field
      .populate('createdProjects')  // Populate the createdProjects field
      .populate('donatedProjects');  // Populate the donatedProjects field
    if (!user) return res.sendStatus(404);
    res.json(user); // Send user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.sendStatus(500);
  }
});

app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, username, email, PhnNo, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id , {fullName, username, email, PhnNo, bio});
    res.json(user);    
  } catch (error) {
    console.error("Error updating user data:", error);
    res.sendStatus(500);
  }
});

app.post('/register', async (req, res) => {
  try {

    const { fullName, username, password, email, PhnNo, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords does not match' });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ fullName, username, email, PhnNo, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("hi");
    res.status(500).json({ message: 'Server error' });
  }
})

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    console.log(user);
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    console.log(isMatch);
    // Generate JWT
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days from now in seconds
    const token = jwt.sign({ sub: user._id, exp }, process.env.JWT_SECRET);
    console.log(token, process.env.JWT_SECRET);
    // Send token and user info (excluding password)
    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, email: user.email, name: user.username } // Add other non-sensitive user fields as needed
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/projects', async (req, res) => {
  const data = await Project.find().populate('owner', 'username');
  res.send(data);
});

app.post('/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, image, requiredAmount, documentation, createdAt } = req.body; // Include createdAt if sending from the body
    const data = await Project.create({
      name,
      description,
      image,
      requiredAmount,
      documentation,
      owner : req.user.id,
      createdAt: createdAt || Date.now() // Use createdAt from body or default to current date
    });

    // Update the user's created projects array
    await User.findByIdAndUpdate(req.user.id, { $push: { createdProjects: data._id } }); // Add the project ID to user's created array

    res.status(201).json(data); // Respond with the created project

  } catch (error) {
    console.log(error);
  }
});

app.get('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('owner', 'username email')    // Populate owner details
      .populate('funders', 'username'); // Populate funders details

    // console.log(project);
    res.send(project);
  } catch (error) {
    console.log(error);
  }
});

app.put('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, requiredAmount, documentation } = req.body;
    const project = await Project.findByIdAndUpdate(id, {
      name, description, image, requiredAmount, documentation
    })
    // console.log(project);
    res.json({ project })
  } catch (error) {
    console.log(error);
  }
});

app.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    res.json({ message: "Project deleted successfully", deletedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Listening on Port Number 3000");
});