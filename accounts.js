document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (username) {
      document.getElementById("usernameInput").value = username;
      // Fetch branches based on the username
      fetch(
        `https://mrspdevelopers.com/public/mypath/fetchBranches.php?username=${username}`
      )
        .then((response) => response.json())
        .then((data) => {
          const branchSelect = document.getElementById("branchSelect");
  
          data.forEach((branch) => {
            const option = document.createElement("option");
            option.value = branch.branchname;
            option.textContent = branch.branchname;
            branchSelect.appendChild(option);
          });
        })
        .catch((error) => console.error("Error fetching branches:", error));
    }
  
    document
      .getElementById("dateRangeFrom")
      .addEventListener("change", validateDateRange);
    document
      .getElementById("dateRangeTo")
      .addEventListener("change", validateDateRange);
  
    function validateDateRange() {
      const dateFrom = document.getElementById("dateRangeFrom").value;
      const dateTo = document.getElementById("dateRangeTo").value;
  
      if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
        alert("End date must be after start date.");
        document.getElementById("dateRangeTo").value = "";
      }
    }
  
    document.getElementById("Go").addEventListener("click", ()=>{fetchIncome();document.getElementById('dailyIncomeTableContainer').style.display='block'});
    document.getElementById("Button1").addEventListener("click", clearFields);
  
    document
      .getElementById("btnlastmonth")
      .addEventListener("click", function () {
        setDateRange(-1); // Last month
      });
    document
      .getElementById("btnlast3month")
      .addEventListener("click", function () {
        setDateRange(-3); // Last 3 months
      });
    document
      .getElementById("btnlast6month")
      .addEventListener("click", function () {
        setDateRange(-6); // Last 6 months
      });
    document
      .getElementById("btnlast12month")
      .addEventListener("click", function () {
        setDateRange(-12); // Last 12 months
      });
  
    function setDateRange(months) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() + months);
      startDate.setDate(1); // Set to the start of the month
      startDate.setHours(0, 0, 0, 0); // Set to the start of the day
  
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // Set to the end of the day
  
      document.getElementById("dateRangeFrom").value = formatDate(startDate);
      document.getElementById("dateRangeTo").value = formatDate(endDate);
    }
  
    function formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  
    function fetchIncome() {
      // Get values from the select and input elements
      const branchname = document.getElementById("branchSelect").value;
      const username = document.getElementById("usernameInput").value;
      const dateRangeFrom = document.getElementById("dateRangeFrom").value;
      const dateRangeTo = document.getElementById("dateRangeTo").value;
  
 
  
      fetch("https://mrspdevelopers.com/public/mypath/fetchIncome.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          branchname: branchname,
          dateRangeFrom: dateRangeFrom,
          dateRangeTo: dateRangeTo,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error:", data.error);
            document.getElementById("spanIncome").innerText =
              "Error fetching income.";
          } else {
            document.getElementById(
              "spanIncome"
            ).innerHTML = `<i class="fa fa-rupee"></i>${data.totalIncome}`;
          }
        })
        .catch((error) => {
          console.error("Error fetching income:", error);
          document.getElementById("spanIncome").innerText =
            "Error fetching income.";
        });
      fetchAndDisplayIncome(dateRangeFrom, dateRangeTo, username, branchname);
    }
  
    function clearFields() {
      document.getElementById("dateRangeFrom").value = "";
      document.getElementById("dateRangeTo").value = "";
      document.getElementById("branchSelect").value = "";
      document.getElementById("spanIncome").textContent = "₹0.00";
    }
    function fetchAndDisplayIncome(dateFrom, dateTo, username, branchname) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://mrspdevelopers.com/public/mypath/fetchDetailedIncome.php",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const tableBody = document.getElementById("dailyIncomeTableBody");
          tableBody.innerHTML = ""; // Clear existing rows
    
          // Reverse the date-wise income data
          const reversedEntries = Object.entries(data.dateWiseIncome).reverse();
    
          // Insert rows for each date in reversed order
          for (const [date, totalPrice] of reversedEntries) {
            const row = document.createElement("tr");
            row.style.border = "0.1px solid grey";
            row.innerHTML = `
                      <td style="border-right:0.1px solid grey;padding:3px">${date}</td>
                      <td style="border-right:0.1px solid grey;padding:2px">${totalPrice}</td> 
                      <td style="border-right:0.1px solid grey;padding:2px">0</td> 
                      <td style="border-right:0.1px solid grey;padding:2px">${totalPrice}</td> 
                      <td style="border-right:0.1px solid grey;padding:2px">0</td> 
                      <td style="border-right:0.1px solid grey;padding:2px">0</td>
                      <td style="border-right:0.1px solid grey;padding:2px">0</td> 
                  `;
            tableBody.appendChild(row);
          }
    
          // Optionally, handle the total income in a separate element
          document.getElementById("totalIncome").innerText = data.totalIncome;
        }
      };
      xhr.send(
        `dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(
          dateTo
        )}&username=${encodeURIComponent(
          username
        )}&branchname=${encodeURIComponent(branchname)}`
      );
    }
    
  });
  
  // Function to fetch and display data