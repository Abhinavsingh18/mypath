
// Get modal elements
const primaryCategoryModal = document.getElementById("primaryCategoryModal");
const secondaryCategoryModal = document.getElementById("secondaryCategoryModal");
const addTestModal = document.getElementById("addTestModal");

// Get button elements
const addPrimaryCategoryBtn = document.getElementById("addPrimaryCategoryBtn");
const addSecondaryCategoryBtn = document.getElementById("addSecondaryCategoryBtn");
const addTestBtn = document.getElementById("addTestBtn");

// Get close elements
const closePrimaryModal = document.getElementById("closePrimaryModal");
const closeSecondaryModal = document.getElementById("closeSecondaryModal");
const closeAddTestModal = document.getElementById("closeAddTestModal");

const primarybtn = document.getElementById("primarybtn");
const secondarybtn = document.getElementById("secondarybtn");
const testbtn = document.getElementById("testbtn");

// Open primary category modal
addPrimaryCategoryBtn.addEventListener("click", () => {
  primaryCategoryModal.style.display = "block";
});

// Open secondary category modal
addSecondaryCategoryBtn.addEventListener("click", () => {
  secondaryCategoryModal.style.display = "block";
});

// Open add test modal
addTestBtn.addEventListener("click", () => {
  addTestModal.style.display = "block";
});

// Close primary category modal
closePrimaryModal.addEventListener("click", () => {
  primaryCategoryModal.style.display = "none";
});
primarybtn.addEventListener("click", () => {
  primaryCategoryModal.style.display = "none";
});

// Close secondary category modal
closeSecondaryModal.addEventListener("click", () => {
  secondaryCategoryModal.style.display = "none";
});
secondarybtn.addEventListener("click", () => {
  secondaryCategoryModal.style.display = "none";
});

// Close add test modal
closeAddTestModal.addEventListener("click", () => {
  addTestModal.style.display = "none";
});
testbtn.addEventListener("click", () => {
  addTestModal.style.display = "none";
});


// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target == primaryCategoryModal) {
    primaryCategoryModal.style.display = "none";
  }
  if (event.target == secondaryCategoryModal) {
    secondaryCategoryModal.style.display = "none";
  }
  if (event.target == addTestModal) {
    addTestModal.style.display = "none";
  }
});

// Handle form submissions
document.getElementById("primaryCategoryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    console.log(data);
    primaryCategoryModal.style.display = "none"; // Hide the modal on successful form submission
  }).catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
});

document.getElementById("secondaryCategoryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    console.log(data);
    secondaryCategoryModal.style.display = "none"; // Hide the modal on successful form submission


  }).catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
});



document.getElementById("addTestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        console.log(data.message);
        alert('Test added successfully'); // Display success message
        document.getElementById('addTestModal').style.display = "none"; // Hide the modal on successful form submission
      } else {
        console.error(data.message);
        alert(data.message); // Display error message
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('There has been a problem with your fetch operation: ' + error.message);
    });
});






document.addEventListener('DOMContentLoaded', function () {

  const primaryCategorySelectInSecondary = document.getElementById('primaryCategorySelectInSecondary');
  const primaryCategorySelectInTest = document.getElementById('primaryCategorySelectInTest');

  // Fetch and populate primary categories for the select in the add SECONDARY modal
  fetchPrimaryCategories(primaryCategorySelectInSecondary);
  // Fetch and populate primary categories for the select in the add test modal
  fetchPrimaryCategories(primaryCategorySelectInTest);


  function fetchPrimaryCategories(selectElement) {
    var url = 'https://rssmarthut.com/mypath/primarycategory.php?fetch=true';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        populatePrimaryCategorySelect(data, selectElement);
        populatePrimaryCategoryTable(data);
      })
      .catch(error => {
        console.error('Error fetching primary categories:', error);
      });
  }

  function populatePrimaryCategorySelect(categories, selectElement) {
    selectElement.innerHTML = ''; // Clear any existing options
    categories.forEach(category => {
      var option = document.createElement('option');
      option.value = category; // Replace with the actual ID field
      option.textContent = category; // Replace with the actual name field
      selectElement.appendChild(option);
    });
  }

  function populatePrimaryCategoryTable(categories) {
    var tableBody = document.getElementById('primaryCategoryTableBody');
    tableBody.innerHTML = ''; // Clear any existing rows

    categories.forEach((category, index) => {
      var row = document.createElement('tr');

      // Sr.No.
      var srNoCell = document.createElement('td');
      srNoCell.textContent = index + 1;
      row.appendChild(srNoCell);

      // Primary Category
      var primaryCategoryCell = document.createElement('td');
      primaryCategoryCell.className = 'primname';
      primaryCategoryCell.style.textAlign = 'left';
      primaryCategoryCell.style.padding = '0 15px';
      primaryCategoryCell.textContent = category; // Replace with the actual name field
      row.appendChild(primaryCategoryCell);

      // Active
      var activeCell = document.createElement('td');
      activeCell.className = 'disbl';
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'disable';
      checkbox.id = 'disable';
      checkbox.disabled = true;
      checkbox.checked = category; // Replace with the actual active field
      activeCell.appendChild(checkbox);
      var label = document.createElement('label');
      label.htmlFor = 'disable';
      label.innerHTML = '<span></span>';
      activeCell.appendChild(label);
      row.appendChild(activeCell);

      // Edit
      var editCell = document.createElement('td');
      var editSpan = document.createElement('span');
      editSpan.className = 'edit';
      var editLink = document.createElement('a');
      editLink.href = '#';
      editLink.textContent = 'edit';
      editLink.addEventListener('click', function () {
        editPrimaryCategory(category); // Define this function to handle editing
      });
      editSpan.appendChild(editLink);
      editCell.appendChild(editSpan);
      row.appendChild(editCell);

      // Append the row to the table body
      tableBody.appendChild(row);
    });

    // Add click listeners to the primary category cells
    addPrimaryCategoryClickListener();
  }

  function editPrimaryCategory(category) {
    console.log('Editing category:', category);
  }

  // Function to add event listeners to primary category cells
  function addPrimaryCategoryClickListener() {
    const primaryCategoryCells = document.querySelectorAll('.primname');

    primaryCategoryCells.forEach(cell => {
      cell.addEventListener('click', function () {
        const primaryCategoryName = this.textContent.trim();
        fetchSecondaryCategories(primaryCategoryName);




      });
    });
  }

  // Function to fetch secondary categories based on primary category name
  function fetchSecondaryCategories(primaryCategoryName) {
    const url = 'https://rssmarthut.com/mypath/secondarycategory.php?fetch=true&pname=' + encodeURIComponent(primaryCategoryName);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        populateSecondaryCategoryTable(data);
      })
      .catch(error => {
        console.error('Error fetching secondary categories:', error);
      });
  }

  // Function to populate the secondary category table
  function populateSecondaryCategoryTable(categories) {
    const tbody = document.getElementById('secondaryCategoryTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    categories.forEach((category, index) => {
      // console.log(category.sname)
      const row = document.createElement('tr');

      const srNoCell = document.createElement('td');
      srNoCell.textContent = index + 1;
      row.appendChild(srNoCell);

      const secondaryCategoryCell = document.createElement('td');
      secondaryCategoryCell.className = 'sname';
      secondaryCategoryCell.textContent = category.sname;
      row.appendChild(secondaryCategoryCell);




      const editCell = document.createElement('td');
      const editSpan = document.createElement('span');
      editSpan.className = 'edit';
      const editLink = document.createElement('a');
      editLink.href = '#';
      editLink.textContent = 'edit';
      editSpan.appendChild(editLink);
      editCell.appendChild(editSpan);
      row.appendChild(editCell);

      tbody.appendChild(row);
    });
  }







  // function addSecondaryCategoryClickListener() {
  //   const secondaryCategoryCells = document.querySelectorAll('.sname');

  //   secondaryCategoryCells.forEach(cell => {
  //     cell.addEventListener('click', function (e) {
  //       const secondaryCategoryName = this.textContent.trim();
  //       fetchTestCategories(secondaryCategoryName);
  //     });
  //   });




  // }

  function fetchTestCategories(secondaryCategoryName) {
    const url = 'https://rssmarthut.com/mypath/testcategory.php?fetch=true&sname=' + encodeURIComponent(secondaryCategoryName);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        populateTestCategoryTable(data);

      })
      .catch(error => {
        console.error('Error fetching test categories:', error);
      });
  }

  function populateTestCategoryTable(testCategories) {
    const tbody = document.getElementById('testCategoryTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    testCategories.forEach((category, index) => {
      const row = document.createElement('tr');

      const srNoCell = document.createElement('td');
      srNoCell.textContent = index + 1;
      row.appendChild(srNoCell);

      const testCategoryCell = document.createElement('td');
      testCategoryCell.textContent = category.tname;
      row.appendChild(testCategoryCell);

      const activeCell = document.createElement('td');
      activeCell.textContent = category.active ? 'Yes' : 'No';
      row.appendChild(activeCell);

      const editCell = document.createElement('td');
      const editSpan = document.createElement('span');
      editSpan.className = 'edit';
      const editLink = document.createElement('a');
      editLink.href = '#';
      editLink.textContent = 'edit';
      editSpan.appendChild(editLink);
      editCell.appendChild(editSpan);
      row.appendChild(editCell);

      tbody.appendChild(row);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('sname')) {
      const secondaryCategoryName = e.target.textContent.trim();
      fetchTestCategories(secondaryCategoryName);
    }
  });


  // Fetch primary categories on page load
  function fetchSecondaryCategoriesInTest(primaryCategorySelectElement, secondaryCategorySelectElement) {
    var primaryCategoryName = primaryCategorySelectElement.value;
    var url = 'https://rssmarthut.com/mypath/secondarycategorylistintest.php?fetch=true&pname=' + primaryCategoryName;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        populateSecondaryCategorySelect(data, secondaryCategorySelectElement);
      })
      .catch(error => {
        console.error('Error fetching secondary categories:', error);
      });
  }

  function populateSecondaryCategorySelect(categories, selectElement) {
    selectElement.innerHTML = ''; // Clear any existing options
    categories.forEach(category => {
      var option = document.createElement('option');
      option.value = category; // Replace with the actual ID field
      option.textContent = category; // Replace with the actual name field
      selectElement.appendChild(option);
    });
  }



  // Event listener to fetch and populate secondary categories when the primary category select in the add test modal is changed
  primaryCategorySelectInTest.addEventListener('change', function () {
    fetchSecondaryCategoriesInTest(this, document.getElementById('secondaryCategory'));
  });



  fetchPrimaryCategories();
  addPrimaryCategoryClickListener();

});


var addTestPriceBtn = document.getElementById("addTestPriceBtn");
var addTestPriceModal = document.getElementById("addTestPriceModal");
var closeAddTestPriceModal = document.getElementById("closeAddTestPriceModal");
var testCategorySelect = document.getElementById("testCategorySelect");
var branchSelect = document.getElementById("branchSelect");

addTestPriceBtn.onclick = function () {
  addTestPriceModal.style.display = "block";

}

closeAddTestPriceModal.onclick = function () {
  addTestPriceModal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == addTestPriceModal) {
    addTestPriceModal.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function () {
// Retrieve username from local storage and set it in the input field
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('usernameInput').value = username;

    // Fetch branches based on the username
    fetch(`https://rssmarthut.com/mypath/fetchBranches.php?username=${username}`)
        .then(response => response.json())
        .then(data => {
            const branchSelect = document.getElementById('branchSelect');
            data.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.branch_code;
                option.textContent = branch.branchname;
                branchSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching branches:', error));
}

let allTests = [];

// Fetch test categories and populate the table
fetch('https://rssmarthut.com/mypath/gettestcategories.php')
    .then(response => response.json())
    .then(data => {
        allTests = data;
        populateTable(allTests);
    })
    .catch(error => console.error('Error fetching tests:', error));

// Add event listener to the search input
document.getElementById('testSearch').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const filteredTests = allTests.filter(test => test.tname.toLowerCase().includes(searchQuery));
    populateTable(filteredTests);
});

function populateTable(tests) {
    const tableBody = document.getElementById('testsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    tests.forEach(test => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        cell1.textContent = test.tname; 

        const cell2 = row.insertCell(1);
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `price_${test.tname}`;
        input.placeholder = test.tprice;
        cell2.appendChild(input);
    });
}

document.getElementById('priceForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('responseMessage').innerHTML = data;
    })
    .catch(error => console.error('Error submitting form:', error));
});
});


