require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const path = require('path');


const app = express();

// Enable CORS for all routes
app.use(cors());

// List of allowed origins
const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: allowedOrigins,  // Array of allowed origins
}));
  
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
