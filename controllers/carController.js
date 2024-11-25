const Car = require('../models/Car');
const Offer = require ('../models/Offer');

/*

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
*/

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();

    // Map each car to add full URL to each image
    const carsWithImageUrls = cars.map(car => ({
      ...car._doc,
      images: car.images.map(image => `${req.protocol}://${req.get('host')}/${image}`)
    }));

    res.json(carsWithImageUrls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCarDetails = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createOffer = async (req, res) => {
  
  try{
    // Implement offer creation logic here
    const { email, message, car } = req.body;

    const newOffer = new Offer({
      email: email,
      message: message,
      car: car // Car Id
    });

    await newOffer.save();
    res.status(201).json({ message: 'Offer posted successfully', offer: newOffer });
  }catch (err) {
    res.status(500).json({ message: 'Server error...' });
  }
};

const addCar = async (req, res) => {
  try {
    const { make, model, year, price, description } = req.body;

    // Extract image paths from req.files
    const imagePaths = req.files.map(file => file.path); // Store paths of uploaded images

    const newCar = new Car({
      make,
      model,
      year,
      price,
      description,
      vendor: req.user.userId, // Vendor ID from authentication
      images: imagePaths // Assign array of image paths to the car
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


/*
const addCar = async (req, res) => {
  try {
    console.log("add car")
    const { make, model, year, price, description } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      price,
      description,
      vendor: req.user.userId,
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
*/

const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCar = async (req, res) => {
  try {

    const { make, model, year, price, description } = req.body;

    const imagePaths = req.files.map(file => file.path); // Store paths of uploaded images
    const links = []
    let idx = 0;
    for (let i =0; i < 5; i++) {
      if (req.body.images[i] !== "<change>")  {
        links.push(req.body.images[i]); //Keep o    
      } else if (idx < imagePaths.length) {
        links.push(imagePaths[idx++])
      } else {
        res.status(400).json({message: "Bad image update"});
        return;
      }
    }
    const newCar = {
      make, 
      model,
      year,
      price,
      description,
      vendor: req.user.userId, // Vendor ID from authentication
      images: links // Assign array of image paths to the car
    }
    const car = await Car.findByIdAndUpdate(req.params.id, newCar, { new: true });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error:err });
  }
};

const getVendorCars = async (req, res) => {
  try {
    const cars = await Car.find({ vendor: req.user.userId });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCarOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ car: req.params.id });
    res.json(offers);
  } catch (err) {
    console.log('Failed to get car offer',err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getAllCars,
  getCarDetails,
  createOffer,
  addCar,
  deleteCar,
  updateCar,
  getVendorCars,
  getCarOffers,
};
