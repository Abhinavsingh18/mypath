
$(document).on("click", ".print-button", function () {
  const reportNumber = $(this).siblings(".reportNumber").data("reportnumber");
  const patientDetails = $(this).siblings(".reportNumber").data(); // Get patient details from data attributes

  $.ajax({
    url: "https://rssmarthut.com/mypath/fetchDetailsToPrint.php",
    type: "GET",
    data: { reportNumber: reportNumber, ...patientDetails }, // Pass patient details along with report number
    dataType: "json",
    success: function (data) {
      if (data.error) {
        console.error(data.error);
        return;
      }

      // Generate PDF
      console.log(patientDetails)
      generatePDF(data, patientDetails);
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    }
  });
});

async function generatePDF(data, patientDetails) {
  try {
    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    // Define page size and create page
    const pageWidth = 600;
    const pageHeight = 800;
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width, height } = page.getSize();

    // Define margins and table width
    const margin = 50;
    const tableWidth = width - 2 * margin;

    // Column width percentages
    const testNameWidthPercent = 0.43;
    const unitWidthPercent = 0.20; // Now for the unit column
    const reportWidthPercent = 0.19; // Now for the report column
    const idealRangeWidthPercent = 0.20;

    // Calculate column widths
    const testNameWidth = tableWidth * testNameWidthPercent;
    const unitWidth = tableWidth * unitWidthPercent;
    const reportWidth = tableWidth * reportWidthPercent;
    const idealRangeWidth = tableWidth * idealRangeWidthPercent;

    // Define row height
    const rowHeight = 30; // Height for table rows
    const reducedRowHeight = 20; // Height for patient details
    const lineOffset = 5; // Distance between the horizontal lines and patient details

    // Define font size and character width
    const fontSize = 10;
    const averageCharacterWidth = 6; // Adjust this value based on your font and size

    // Initial yPosition
    let yPosition = height - margin - 50;

    // Draw horizontal line above patient details
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Draw patient details in two columns
    const halfPageWidth = pageWidth / 2;
    const details = [
      `Report Number : ${patientDetails.reportnumber}`,
      `Patient Name    : ${patientDetails.patientname}`,
      `PID                    : ${patientDetails.pid}`,
      `Age                    : ${patientDetails.age}(Y)`,
      `Gender              : ${patientDetails.gender}`,
      `ID                      : ${patientDetails.id}`,
      `Advised Date    : ${patientDetails.adviseddate.split(" ")[0]}`,
      `Referred By      : ${patientDetails.referredby}`,
      `Mode                : ${patientDetails.reportdeliverymode}`,
      `Branch              : ${patientDetails.locations}`
    ];

    details.forEach((detail, index) => {
      if (index < 5) {
        page.drawText(detail, { x: margin, y: yPosition - (index + 1) * reducedRowHeight - lineOffset, size: 10, color: rgb(0, 0, 0) });
      } else {
        page.drawText(detail, { x: halfPageWidth + margin, y: yPosition - (index - 4) * reducedRowHeight - lineOffset, size: 10, color: rgb(0, 0, 0) });
      }
    });

    // Adjust yPosition to avoid large gaps
    yPosition -= 7 * reducedRowHeight;
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Adjust yPosition to shift everything down by 1 unit
    yPosition -= 7; // Shift down by 1 unit

    // Draw test name centered above the table
    const testNameText = patientDetails.testname;

    // Estimate text width
    const testNameTextWidth = testNameText.length * averageCharacterWidth;
    const testNameX = (width - testNameTextWidth) / 2; // Center the text horizontally
    const testNameY = yPosition - 10; // Position the text slightly above the table

    page.drawText(testNameText, { x: testNameX -20, y: testNameY, size: 15, color: rgb(0, 0, 0) });

    // Draw table headers
    yPosition -= rowHeight;
    page.drawText('TEST NAME', { x: margin, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    page.drawText('REPORT', { x: margin + testNameWidth, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    page.drawText('UNIT', { x: margin + testNameWidth + reportWidth, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    page.drawText('IDEAL RANGE', { x: margin + testNameWidth + reportWidth + unitWidth, y: yPosition, size: 12, color: rgb(0, 0, 0) });

    // Draw table rows
    yPosition -= rowHeight;
    data.forEach(item => {
      const reportValue = parseFloat(item.reportValue);
      const rangeFrom = parseFloat(item.rangeFrom);
      const rangeTo = parseFloat(item.rangeTo);

      // Draw test name, report, unit, and ideal range
      page.drawText(item.rangeName, { x: margin, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(reportValue.toString(), { x: margin + testNameWidth, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(item.unit, { x: margin + testNameWidth + reportWidth, y: yPosition, size: 10, color: rgb(0, 0, 0) });

      // Calculate text width for report value and underline it if needed
      const reportText = reportValue.toString();
      const reportTextWidth = reportText.length * averageCharacterWidth;
      const reportTextX = margin + testNameWidth;
      page.drawText(reportText, { x: reportTextX, y: yPosition, size: 10, color: rgb(0, 0, 0) });

      // Draw ideal range
      const idealRangeText = `${item.rangeFrom}-${item.rangeTo}`;
      page.drawText(idealRangeText, { x: margin + testNameWidth + reportWidth + unitWidth, y: yPosition, size: 10, color: rgb(0, 0, 0) });

      // Underline the REPORT value if necessary
      if (reportValue < rangeFrom || reportValue > rangeTo) {
        page.drawLine({
          start: { x: reportTextX, y: yPosition - 4 }, // Line below text
          end: { x: reportTextX + reportTextWidth, y: yPosition - 4 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }

      yPosition -= rowHeight;

      // Add more pages if necessary
      if (yPosition < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = height - margin - 50; // Reset yPosition for the new page
      }
    });

    // Save the PDF and download it
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patientDetails.patientname}_${patientDetails.reportnumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}


















$(document).ready(function () {
  // Fetch branches based on username
  var username = localStorage.getItem("username");

  if (!username) {
    console.error("No username found in local storage.");
    return;
  }

  $.ajax({
    url: "https://rssmarthut.com/mypath/fetchBranches.php",
    type: "GET",
    data: { username: encodeURIComponent(username) },
    dataType: "json",
    success: function (data) {
      if (data.error) {
        console.error(data.error);
        return;
      }

      var branchDropdown = $("#selectBranches");
      branchDropdown.empty(); // Clear existing entries

      if (data.length === 0) {
        branchDropdown.append("<p>No branches found.</p>");
        return;
      }

      $.each(data, function (index, branch) {
        branchDropdown.append(
          `<p><input type="checkbox" class="branch-checkbox" data-branch-id="${branch.branchid}" id="chkLocation${index}"/>
                    <label for="chkLocation${index}"><span></span>${branch.branchname}</label></p>`
        );
      });

      branchDropdown.show(); // Show the dropdown if it was hidden
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status + " - " + error);
    },
  });

  // Handle clicks on dynamically added checkboxes
  $("#selectBranches").on("change", ".branch-checkbox", function () {
    var selectedBranchId = $(this).data("branch-id");
    var selectedBranchName = $(this).next("label").text();
    $(".branches > a").text(selectedBranchName);

    const date = $("#lbldate").val();
    fetchPatients(selectedBranchName, date);
  });

  // Fetch and display patient data
  function fetchPatients(branchname, date) {
    $.ajax({
        url: "https://rssmarthut.com/mypath/worklist.php",
        type: "GET",
        data: { branchname: branchname, date: date },
        dataType: "json",
        success: function (data) {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const tableBody = $("#patientsTableBody");
            tableBody.empty();

            let totalSum = 0;

            data.forEach((patient) => {
                const row = $("<tr>");
                row.append(`<td>${patient.id}</td>`);
                row.append(`<td>${patient.pid}</td>`);
                row.append(`<td>${patient.patientname}</td>`);
                row.append(`<td>${patient.advisedDate.split(" ")[0]}</td>`);
                row.append(`<td>${patient.advisedByDoctor}</td>`);
                row.append(`<td>${patient.advisedByFacility}</td>`);
                row.append(`<td>${patient.referredBy}</td>`);

                // Parse selected tests and calculate total price
                const selectedTestsArray = JSON.parse(patient.selectedTests);
                const totalPrice = selectedTestsArray.reduce(
                    (sum, test) => sum + parseFloat(test.price),
                    0
                );

                totalSum += totalPrice;

                row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                row.append(`<td>0</td>`);
                row.append(`<td>0</td>`);
                row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                tableBody.append(row);

                // Function to handle row color based on report number availability
                function checkAllReportNumbersAvailability(selectedTestsArray, row) {
                    let allFound = true;

                    selectedTestsArray.forEach((test, index) => {
                        checkReportNumberAvailability(test.REPORTNUMBER, null, function (exists) {
                            if (!exists) {
                                allFound = false;
                            }

                            // Apply color based on availability after all checks are done
                            if (index === selectedTestsArray.length - 1) {
                                if (allFound) {
                                    row.css("background-color", "lightgreen");
                                } else {
                                    row.css("background-color", "lightpink");
                                }
                            }
                        });
                    });
                }

                checkAllReportNumbersAvailability(selectedTestsArray, row);

                row.on("click", function () {
                    if ($(this).next(".k-detail-row").length) {
                        $(this).next(".k-detail-row").toggle();
                    } else {
                        const detailRow = $("<tr>").addClass("k-detail-row k-alt");
                        const detailCell = $("<td>")
                            .addClass("k-detail-cell")
                            .attr("colspan", "12");

                        // Create HTML for selected tests
                        const selectedTestsHTML = selectedTestsArray
                            .map(
                                (test) => `
                                    <tr data-testdetail="testDetail" class="purple k-state-selected">
                                        <td style="width:15vw">${test.testname}</td>
                                        <td style="width:26.2vw">
                                            <a class="reportNumber" tabindex="0" style="color:red"
                                               data-id=${patient.id}
                                               data-referredBy=${patient.referredBy}
                                               data-reportDeliveryMode=${patient.reportDeliveryMode}
                                               data-patientname="${patient.patientname}" 
                                               data-adviseddate="${patient.advisedDate}"
                                               data-testname="${test.testname}"
                                               data-gender="${patient.gender}" 
                                               data-age="${patient.age}" 
                                               data-pid="${patient.pid}"
                                               data-locations="${patient.locations}"
                                               data-reportnumber="${test.REPORTNUMBER}">
                                               ${test.REPORTNUMBER}
                                            </a>
                                            <button class="print-button" style="display: none;border: none;padding-left: 5px;color: #212121;scale: 0.9;padding-right: 8px;border-radius: 9px;background-color: #e99700">Print</button>
                                        </td>
                                        <td style="width:12vw">${patient.advisedDate.split(" ")[0]}</td>
                                        <td style="width:6vw;"></td>
                                        <td></td>
                                        <td>default</td>
                                    </tr>
                                `
                            )
                            .join("");

                        detailCell.html(`
                            <div class="k-grid k-widget" style="height: 160px;width:99vw; margin:auto">
                                <div class="k-grid-header" style="padding-right: 17px;">
                                    <div class="k-grid-header-wrap" data-role="resizable">
                                        <table role="grid">
                                            <colgroup>
                                                <col>
                                                <col>
                                                <col>
                                                <col>
                                                <col>
                                                <col>
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th style="width: 13vw" class="k-header">Test Name</th>
                                                    <th style="width: 23vw" class="k-header">Report Number</th>
                                                    <th style="width: 10.6vw" class="k-header">Advised Date</th>
                                                    <th style="width: 5.2vw;" class="k-header">Report Status</th>
                                                    <th style="width:23vw" class="k-header">Sample</th>
                                                    <th style="width:160px" class="k-header">Panel Company</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div class="k-grid-content" style="height: 126.4px;">
                                    <table data-role="grid" role="grid" style="height: auto;" class="k-selectable">
                                        <colgroup>
                                            <col style="width=15vw">
                                            <col>
                                            <col>
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            ${selectedTestsHTML}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `);
                        detailRow.append(detailCell);
                        $(this).after(detailRow);

                        // Check availability of report numbers and associate each one with its respective print button
                        selectedTestsArray.forEach((test) => {
                            const printButton = $(detailRow).find(`[data-reportnumber="${test.REPORTNUMBER}"]`).next('.print-button');
                            checkReportNumberAvailability(test.REPORTNUMBER, printButton);
                        });
                    }
                });
            });

            // Update footer with total sum
            $(".k-footer-template td").eq(8).text(totalSum.toFixed(2));
            $(".k-footer-template td").eq(11).text(totalSum.toFixed(2));
            $(".k-footer-template td").eq(12).text(totalSum.toFixed(2));
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + status + " - " + error);
        },
    });
}

function checkReportNumberAvailability(reportNumber, printButton, callback) {
    $.ajax({
        url: "https://rssmarthut.com/mypath/checkReportNumber.php",
        type: "GET",
        data: { reportNumber: reportNumber },
        dataType: "json",
        success: function (data) {
            if (data.exists) {
                console.log(`${reportNumber} exists`);
                if (printButton) {
                    printButton.show(); // Show the print button for the specific report number
                }
                if (callback) {
                    callback(true);
                }
            } else {
                console.log(`${reportNumber} not found`);
                if (callback) {
                    callback(false);
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
            if (callback) {
                callback(false);
            }
        },
    });
}




  // Handle clicks on report number links
  $(document).on("click", ".reportNumber", function (event) {
    event.preventDefault();

    var reportNumber = $(this).text().trim();
    var patientName = $(this).data("patientname");
    var pidNumber = $(this).data("pid");
    var advisedDate = $(this).data("adviseddate");
    var testName = $(this).data("testname");
    var gender = $(this).data("gender");
    var age = $(this).data("age");
    var branchName = $(".branch-checkbox:checked").next("label").text(); // Get the branch name

    $("#hoverResultSrNo").text(reportNumber);
    $("#hoverTestName").text(testName);
    $("#hoverPatientName").text(patientName);
    $("#hoverPidNumber").text(pidNumber);
    $("#hoverAdvisedDate").text(advisedDate);
    $("#hovergender").text(gender);
    $("#hoverage").text(age);

    // Fetch range data and display it
    fetchRangeData(testName, age, gender, branchName);

    $("#divHoverGridResult").fadeIn(); // Open the modal
  });

  // Close modal functionality
  $("#MainContent_LISInvestigationWorkListControl_btnResultClose").click(
    function () {
      $("#divHoverGridResult").fadeOut(); // Close the modal
    }
  );

  $(window).click(function (event) {
    if ($(event.target).is("#divHoverGridResult")) {
      $("#divHoverGridResult").fadeOut(); // Close the modal when clicking outside
    }
  });

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
                fetchAndPopulateRowData(entry.range_name);
            });

            $("#rangeDescription").html(rangeDescription);

            // Add the Save All button if not already present
            const saveAllBtn = document.getElementById("saveAllBtn");
            if (!saveAllBtn) {
                const newSaveAllBtn = document.createElement("button");
                newSaveAllBtn.id = "saveAllBtn";
                newSaveAllBtn.style.borderRadius = "6px";
                newSaveAllBtn.style.border = "none";
                newSaveAllBtn.style.paddingLeft = "10px";
                newSaveAllBtn.style.paddingRight = "10px";
                newSaveAllBtn.style.backgroundColor = "green";
                newSaveAllBtn.style.color = "white";
                newSaveAllBtn.textContent = "Save All";

                const container = document.getElementById("rangeContainer");
                if (container) {
                    container.appendChild(newSaveAllBtn);
                } else {
                    console.error("Parent container #rangeContainer not found.");
                }

                // Add event listener to Save All button
                newSaveAllBtn.addEventListener("click", function () {
                    document.querySelectorAll(".save-row-btn").forEach((button) => {
                        button.click();
                    });
                });
            }

            // Attach event listeners to dynamically created save buttons
            attachSaveRowButtonListeners();
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
        },
    });
}

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



function attachSaveRowButtonListeners() {
    document.querySelectorAll(".save-row-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = button.getAttribute("data-index");
            const row = document.querySelector(`.range-row[data-index='${index}']`);

            const rangeName = row.querySelector("p:nth-child(1)").textContent.trim();
            const unit = row.querySelector("p:nth-child(2)").textContent.trim();
            const type = row.querySelector("p:nth-child(3)").textContent.trim();
            const criticalLow = row.querySelector("p:nth-child(4) > span:nth-child(1)").textContent.trim();
            const rangeFrom = row.querySelector("p:nth-child(4) > span:nth-child(2) > span:nth-child(1)").textContent.trim();
            const rangeTo = row.querySelector("p:nth-child(4) > span:nth-child(2) > span:nth-child(2)").textContent.trim();
            const criticalHigh = row.querySelector("p:nth-child(4) > span:nth-child(3)").textContent.trim();
            const reportValue = row.querySelector(".report-value").value.trim();
            const remark = row.querySelector(".remark").value.trim();

            const dataToSend = {
                reportNumber: document.getElementById("hoverResultSrNo").textContent.trim(),
                testName: document.getElementById("hoverTestName").textContent.trim(),
                pid: document.getElementById("hoverPidNumber").textContent.trim(),
                rangeName,
                unit,
                type,
                criticalLow,
                rangeFrom,
                rangeTo,
                criticalHigh,
                reportValue,
                remark,
            };

            
            $.ajax({
                url: "https://rssmarthut.com/mypath/saveRangeDetails.php",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(dataToSend),
                success: function (response) {
                    console.log("Data saved successfully:", response);
                },
                error: function (xhr, status, error) {
                    console.error("Error saving data:", status, error);
                },
            });
        });
    });
}




});

$("#saveButton").click(function () {
  var reportNumber = $("#hoverResultSrNo").text().trim();

  var reportData = [];
  $("#rangeDescription div").each(function () {
    var testname = $(this).find("p").eq(0).text().trim();
    var unit = $(this).find("p").eq(1).text().trim();
    var type = $(this).find("p").eq(2).text().trim();
    var criticalLow = $(this).find("p").eq(3).find("span").eq(0).text().trim();
    var criticalHigh = $(this).find("p").eq(3).find("span").eq(2).text().trim();
    var resultValue = $(this).find("input").eq(0).val().trim();
    var remarks = $(this).find("input").eq(1).val().trim();

    reportData.push({
      testname: testname,
      unit: unit,
      type: type,
      criticalLow: criticalLow,
      criticalHigh: criticalHigh,
      resultValue: resultValue,
      remarks: remarks,
    });
  });

  $.ajax({
    url: "https://rssmarthut.com/mypath/updateReportData.php",
    type: "POST",
    data: {
      reportNumber: reportNumber,
      reportData: JSON.stringify(reportData),
    },
    dataType: "json",
    success: function (response) {
      if (response.success) {
        alert("Data saved successfully!");
        $("#divHoverGridResult").fadeOut(); // Close the modal
      } else {
        console.error("Error saving data:", response.error);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status + " - " + error);
    },
  });
});
