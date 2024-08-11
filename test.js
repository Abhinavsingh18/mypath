function fetchRangeData(testname, age, gender, branch) {
  console.log("Parameters for AJAX request:");
  console.log("Test Name:", testname);
  console.log("Age:", age);
  console.log("Gender:", gender);
  console.log("Branch:", branch);

  $.ajax({
      url: "https://rssmarthut.com/mypath/fetchRangeData.php",
      type: "GET",
      data: { testname: testname, age: age, gender: gender, branch: branch },
      dataType: "json",
      success: function (data) {
          console.log("Data received from server:", data);

          if (data.error) {
              console.error("Error in response:", data.error);
              return;
          }

          let rangeDescription = "";
          data.forEach((entry, index) => {
              const rangeInfo =
                  `<div class="range-row" data-index="${index}" style="display:flex; align-items: center;">
                      <p style="width:18vw">${entry.range_name || "N/A"}</p>
                      <p style="width:6vw">${entry.unit || "N/A"}</p>
                      <p style="width:7.3vw">${entry.type || "N/A"}</p>
                      <p style="width:8.9vw">
                          <span style="background-color:red;color:white;padding-left:4px;padding-right:4px;border-radius:3px">${entry.critical_low || "N/A"}</span>
                          <span style="background-color:#25a0ff;padding-left:4px;padding-right:4px;color:white;border-radius:3px"><span>${entry.range_from || "N/A"}</span> - <span>${entry.range_to || "N/A"}</span></span>
                          <span style="background-color:red;color:white;padding-left:4px;padding-right:4px;border-radius:3px">${entry.critical_high || "N/A"}</span>
                      </p>
                      <p style="width:19.8vw"><input type="text" class="report-value" placeholder="Report Value" style="border:none;border-radius:3px;margin-bottom:5.4px"></p>
                      <p style="width:12vw"><input type="text" class="remark" placeholder="Remark" style="border:none;border-radius:3px;margin-bottom:5.4px"></p>
                      <button style="border-radius: 6px; border: none; padding-left: 4px; padding-right: 4px; background-color: cornflowerblue;" class="save-row-btn" data-index="${index}">Save</button>
                  </div>`;
              rangeDescription += rangeInfo;
              
              // Automatically fetch and populate row data
              fetchAndPopulateRowData(entry.range_name);
          });

          $("#rangeDescription").html(rangeDescription);
      },
      error: function (xhr, status, error) {
          console.error("AJAX Error:", status, error);
      },
  });
}

// Function to fetch and populate row data
function fetchAndPopulateRowData(rangeName) {
const reportNumber = document.getElementById("hoverResultSrNo").textContent.trim();
const testName = document.getElementById("hoverTestName").textContent.trim();
const pid = document.getElementById("hoverPidNumber").textContent.trim();


$.ajax({
    url: "https://rssmarthut.com/mypath/fetchDetails.php",
    type: "GET",
    data: { reportNumber, testName, pid, rangeName },
    dataType: "json",
    success: function (data) {
         if (data.error) {
            console.error("Error in response:", data.error);
            return;
        }

        // Iterate over each row to find the matching rangeName
        document.querySelectorAll('.range-row').forEach(row => {
            const rowRangeName = row.querySelector('p:nth-child(1)').textContent.trim();

          
            if (rowRangeName === rangeName) {
                row.querySelector(".report-value").value = data.reportValue || "N/A";
                row.querySelector(".remark").value = data.remark || "N/A";
            }
        });
    },
    error: function (xhr, status, error) {
        console.error("AJAX Error:", status, error);
    },
});
}