const API_URL = 'http://localhost:5000';

// Utility to display cars in Bootstrap cards
const displayCars = (cars) => {
    const carsContainer = document.getElementById('vendorCarsResponse');
    carsContainer.innerHTML = ''; // Limpiar contenido anterior
  
    cars.forEach(car => {
      const carCard = document.createElement('div');
      carCard.classList.add('col-md-4', 'mb-4'); // Agrega 'mb-4' para margen inferior
  
      const firstImage = car.images.length > 0 ? `${API_URL}/${car.images[0]}` : 'https://via.placeholder.com/150';
  
      carCard.innerHTML = `
        <div class="card">
          <img src="${firstImage}" alt="${car.make} ${car.model}" class="card-img-top" style="max-height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${car.make} ${car.model} (${car.year})</h5>
            <h6 class="card-subtitle mb-2 text-muted">$${car.price}</h6>
            <p class="card-text">${car.description}</p>
          </div>
        </div>
      `;
  
      carsContainer.appendChild(carCard);
    });
  };

// Fetch vendor's cars
const fetchVendorCars = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'index.html'; // Redirect to login if not authenticated
    return;
  }

  const response = await fetch(`${API_URL}/cars/vendors/cars`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (Array.isArray(data)) {
    displayCars(data);
  } else {
    document.getElementById('vendorCarsResponse').innerHTML = `<p>${data.message}</p>`;
  }
};

// create car form

document.getElementById('createCarForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You must be logged in as a vendor to create a car.');
    return;
  }

  const formData = new FormData();
  formData.append('make', document.getElementById('carMake').value);
  formData.append('model', document.getElementById('carModel').value);
  formData.append('year', document.getElementById('carYear').value);
  formData.append('price', document.getElementById('carPrice').value);
  formData.append('description', document.getElementById('carDescription').value);

  const images = document.getElementById('images').files;
  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i]); // Add each image to the form data
  }

  const response = await fetch(`${API_URL}/cars/vendors/cars`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  // const data = await response.json();
// displayResponse('createCarResponse', data);
});

// Call function to load vendor's cars on page load
window.onload = fetchVendorCars;
