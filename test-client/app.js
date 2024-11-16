const API_URL = 'http://localhost:5000';

// Utility to display the response
const displayResponse = (responseDiv, message) => {
    document.getElementById(responseDiv).innerHTML = `<pre>${JSON.stringify(message, null, 2)}</pre>`;
};
// Registration section
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.json();
        displayResponse('registrationResponse', data.message);
    } catch (error) {
        console.error('Error during registration:', error);
        displayResponse('registrationResponse', error.message);
    }
});


// User login and save token
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'vendor-cars.html'; // Redirect after login
    }else{
        displayResponse('loginResponse', data);

    }
});

// Logout function
const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from storage
    alert('You have been logged out.');
  };
  
  // Add logout button functionality
  document.getElementById('logoutBtn').addEventListener('click', logout);


  // Function to display cars with images
  const displayCars = (cars) => {
    const carsContainer = document.getElementById('carsResponse');
    carsContainer.innerHTML = ''; // Clear previous entries
  
    cars.forEach(car => {
      const carDiv = document.createElement('div');
      carDiv.classList.add('car');
  
      // Basic car details
      carDiv.innerHTML = `
        <h3>${car.make} ${car.model} (${car.year})</h3>
        <p>Price: $${car.price}</p>
        <p>${car.description}</p>
      `;
  
      // Display images
      car.images.forEach(imageUrl => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${car.make} ${car.model}`;
        img.style.width = '200px'; // Optional styling
        img.style.margin = '5px';
        carDiv.appendChild(img);
      });
  
      carsContainer.appendChild(carDiv);
    });
  };
  
  // Fetch all cars (Public User)
  document.getElementById('viewCarsBtn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_URL}/cars`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
  
      // Check if response includes car data and display it
      if (Array.isArray(data)) {
        displayCars(data);
      } else {
        displayResponse('carsResponse', data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      displayResponse('carsResponse', 'Error fetching cars');
    }
  });


/*
// Fetch all cars (Public User)
document.getElementById('viewCarsBtn').addEventListener('click', async () => {
    const response = await fetch(`${API_URL}/cars`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    displayResponse('carsResponse', data);
});

*/
// Fetch specific car details
document.getElementById('viewCarBtn').addEventListener('click', async () => {
    const carId = document.getElementById('carId').value;

    const response = await fetch(`${API_URL}/cars/${carId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    displayResponse('carResponse', data);
});

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
  
    const data = await response.json();
    displayResponse('createCarResponse', data);
  });
  
// Create new Offer

document.getElementById('createOffer').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('email', document.getElementById('offerEmail').value);
  formData.append('message', document.getElementById('offerMessage').value);

  const response = await fetch(`${API_URL}/offers`, {
    method: 'POST',
    headers: {
      headers: { 'Content-Type': 'application/json' },
    },
    body: formData
  });

  const data = await response.json();
    displayResponse('offerResponse', data);
});

/*
// Create a car (Only for Vendors)
document.getElementById('createCarForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must be logged in as a vendor to create a car.');
        return;
    }

    const make = document.getElementById('carMake').value;
    const model = document.getElementById('carModel').value;
    const year = document.getElementById('carYear').value;
    const price = document.getElementById('carPrice').value;
    const description = document.getElementById('carDescription').value;

    const response = await fetch(`${API_URL}/cars/vendors/cars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ make, model, year, price, description }),
    });

    const data = await response.json();
    displayResponse('createCarResponse', data);
});

*/
