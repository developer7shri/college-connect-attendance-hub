const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => res.send('SCAHTS API Running'));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Mount Admin routes
app.use('/api/hod', require('./routes/hodRoutes')); // Mount HOD routes
app.use('/api/teacher', require('./routes/teacherRoutes')); // Mount Teacher routes
app.use('/api/student', require('./routes/studentRoutes')); // Mount Student routes

const connectDB = require('./config/db');

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
