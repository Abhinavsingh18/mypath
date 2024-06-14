function loadNavbar() {
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
  }

  // Call the function to load the navbar
  loadNavbar();