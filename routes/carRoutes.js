const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllCars, getCarDetails, createOffer, addCar, deleteCar, updateCar, getVendorCars, getCarOffers } = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage });

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarDetails);
router.post('/offers', createOffer);

// Vendor routes (protected)
router.post('/vendors/cars', authMiddleware, upload.array('images', 10), addCar);
//router.post('/vendors/cars', authMiddleware, addCar);
router.delete('/vendors/cars/:id', authMiddleware, deleteCar);
router.put('/vendors/cars/:id', authMiddleware, upload.array('uploads', 5), updateCar);
router.get('/vendors/cars', authMiddleware, getVendorCars);
router.get('/vendors/cars/:id/offers', authMiddleware, getCarOffers);

module.exports = router;
