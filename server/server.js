const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
