document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("usernameInput").value = username;
    // Fetch branches based on the username
    fetch(
      `https://rssmarthut.com/mypath/fetchBranches.php?username=${username}`
    )
      .then((response) => response.json())
      .then((data) => {
        const branchSelect = document.getElementById("branchSelect");

        data.forEach((branch) => {
          const option = document.createElement("option");
          option.value = branch.branch_code;
          option.textContent = branch.branchname;
          branchSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching branches:", error));
  }
});
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
