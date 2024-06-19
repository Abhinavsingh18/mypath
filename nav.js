function loadNavbar() {
  fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('navbar').innerHTML = data;

          // Retrieve the username from local storage
          const username = localStorage.getItem('username');

          // Check if the username is available
          if (username) {
              // Display the username
              document.getElementById('username').textContent = `Hi, ${username}`;
          } else {
              // Optionally handle the case where the username is not found
              // For example, redirect to login page
              window.location.href = 'index.html'; // Adjust the path to your login page
          }
      })
      .catch(error => console.error('Error loading navbar:', error));
}

// Call the function to load the navbar
loadNavbar();