const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

// Load env vars
dotenv.config();

const app = express();

// Enable CORS - BEFORE YOUR ROUTES
app.use(cors({
  origin: 'http://localhost:8080', // Allow your frontend origin
  credentials: true // If you need to send cookies or authorization headers
}));

// Init Middleware
app.use(express.json());

// app.get('/', (req, res) => res.send('SCAHTS API Running')); // Original simple route
// It's better to have this after CORS if it's a testable endpoint,
// but for a simple "API Running" message, its position is less critical.
// However, general practice is to define middlewares before routes.
// The main app.get('/') can be considered a route.
// For this task, I will ensure CORS is before actual API routes.
// The line `app.use(express.json());` is fine where it is.

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
