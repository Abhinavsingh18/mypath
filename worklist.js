 $(document).ready(function () {
 // Get username from local storage
 var username = localStorage.getItem("username");

 // Check if username exists in local storage
 if (!username) {
     console.error("No username found in local storage.");
     return;
 }

 // Fetch branches based on username
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

         // Populate dropdown with branch names
         $.each(data, function (index, branch) {
             branchDropdown.append(
                 '<p><input type="checkbox" class="branch-checkbox" data-branch-id="' +
                 branch.branchid +
                 '" id="chkLocation' +
                 index +
                 '"/><label for="chkLocation' +
                 index +
                 '"><span></span>' +
                 branch.branchname +
                 "</label></p>"
             );
         });

         branchDropdown.show(); // Show the dropdown if it was hidden
     },
     error: function (xhr, status, error) {
         console.error("AJAX Error: " + status + " - " + error);
     },
 });

 // Event delegation to handle clicks on dynamically added checkboxes
 $("#selectBranches").on("change", ".branch-checkbox", function () {
     // Get the ID of the selected branch
     var selectedBranchId = $(this).data("branch-id");

     // Get the branch name associated with the selected ID
     var selectedBranchName = $(this).next("label").text();

     // Update the "Branches" label with the selected branch name
     if ($(this).is(":checked")) {
         $(".branches > a").text(selectedBranchName);
     } else {
         // If no branch is selected, reset the label
         $(".branches > a").text("Branches");
     }
     const date = document.getElementById("lbldate").value;
     console.log(date)
     fetchPatients(selectedBranchName,date);
     // Handle the selected branch ID and perform additional actions if needed
 });
});

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

            // Get the table body element
            const tableBody = document.getElementById("patientsTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            // Populate the table with patient data
            data.forEach((patient) => {
                const row = document.createElement("tr");

                // Create cells for each column and append to the row
                const idCell = document.createElement("td");
                idCell.textContent = patient.id;
                row.appendChild(idCell);

                const pidCell = document.createElement("td");
                pidCell.textContent = patient.pid;
                row.appendChild(pidCell);

                const nameCell = document.createElement("td");
                nameCell.textContent = patient.patientname;
                row.appendChild(nameCell);
                
                const dateCell = document.createElement("td");
                dateCell.textContent = patient.advisedDate.split(' ')[0];
                row.appendChild(dateCell);

                const doctorCell = document.createElement("td");
                doctorCell.textContent = patient.advisedByDoctor;
                row.appendChild(doctorCell);
                
                const facilityCell = document.createElement("td");
                facilityCell.textContent = patient.advisedByFacility;
                row.appendChild(facilityCell);
                
                const referredCell = document.createElement("td");
                referredCell.textContent = patient.referredBy;
                row.appendChild(referredCell);
                
                const testsCell = document.createElement("td");
                const selectedTestsArray = JSON.parse(patient.selectedTests);
                const totalPrice = selectedTestsArray.reduce((sum, test) => sum + parseFloat(test.price), 0);
                testsCell.textContent = totalPrice.toFixed(2);
                row.appendChild(testsCell);
                
                const disCell = document.createElement("td");
                disCell.textContent = 0;
                row.appendChild(disCell);
                
                const taxCell = document.createElement("td");
                taxCell.textContent = 0;
                row.appendChild(taxCell);
                
                const netCell = document.createElement("td");
                netCell.textContent = totalPrice.toFixed(2);
                row.appendChild(netCell);
                
                const balCell = document.createElement("td");
                balCell.textContent = totalPrice.toFixed(2);
                row.appendChild(balCell);

                // Append the row to the table body
                tableBody.appendChild(row);

                // Add click event listener to the row
                row.addEventListener("click", function() {
                    // Check if detail row already exists
                    if (row.nextElementSibling && row.nextElementSibling.classList.contains("k-detail-row")) {
                        // Toggle the visibility of the detail row
                        row.nextElementSibling.style.display = row.nextElementSibling.style.display === "none" ? "table-row" : "none";
                    } else {
                        // Create detail row
                        const detailRow = document.createElement("tr");
                        detailRow.classList.add("k-detail-row", "k-alt");
                        const detailCell = document.createElement("td");
                        detailCell.classList.add("k-detail-cell");
                        detailCell.colSpan = 12;

                        // Create detail table
                        const detailTableHTML = `
                            <div class="k-grid k-widget" style="height: 160px;width:100vw; margin:auto">
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
                                                <col>
                                                
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th style="width: 200px" class="k-header">Test Name</th>
                                                    <th style="width: 346px" class="k-header">Report Number</th>
                                                    <th style="width: 160px" class="k-header">Advised Date</th>
                                                    <th style="width: 80px;" class="k-header">Report Status</th>
                                                    <th style="width:345px" class="k-header">Sample</th>
                                                    <th style="width:160px" class="k-header">Panel Company</th>
                                                    
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div class="k-grid-content" style="height: 126.4px;">
                                    <table data-role="grid" role="grid" style="height: auto;" class="k-selectable">
                                        <colgroup>
                                            <col>
                                            <col>
                                            <col>
                                            
                                            <col>
                                            
                                        </colgroup>
                                        <tbody>
                                            ${selectedTestsArray.map(test => `
                                                <tr data-testdetail="testDetail" class="purple k-state-selected" aria-selected="true">
                                                    <td style="width:200px">${test.testname}</td>
                                                    <td><a class="reportNumber" tabindex="0" style="color:red" data-patientname="${patient.patientname}" data-adviseddate="${patient.advisedDate}" data-testname="${test.testname}">${test.REPORTNUMBER}</a></td>
                                                    <td style="width:160px">${patient.advisedDate.split(' ')[0]}</td>
                                                    <td style="width:80px;"></td>
                                                    <td></td>
                                                    <td>default</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;

                        detailCell.innerHTML = detailTableHTML;
                        detailRow.appendChild(detailCell);

                        // Insert detail row below the current row
                        row.parentNode.insertBefore(detailRow, row.nextSibling);
                    }
                });
            });
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + status + " - " + error);
        },
    });
}


$(document).ready(function () {
    // Add click event listener for report number links
    $(document).on('click', '.reportNumber', function (event) {
        event.preventDefault(); // Prevent default link behavior
        
        // Get the report number and additional data from the clicked element
        var reportNumber = $(this).text().trim();
        var patientName = $(this).data('patientname');
        var advisedDate = $(this).data('adviseddate');
        var testName = $(this).data('testname');

        // Update the modal with the report number, test name, patient name, and advised date
        $('#hoverResultSrNo').text(reportNumber);
        $('#hoverTestName').text(testName);
        $('#hoverPatientName').text(patientName);
        $('#hoverAdvisedDate').text(advisedDate);

        // Display the modal
        $('#divHoverGridResult').fadeIn(); // Using fadeIn for smooth appearance
    });

    // Add click event listener for the close button in the modal
    $('#MainContent_LISInvestigationWorkListControl_btnResultClose').click(function () {
        $('#divHoverGridResult').fadeOut(); // Using fadeOut for smooth disappearance
    });

    // Close the modal if user clicks outside of the modal content
    $(window).click(function (event) {
        if ($(event.target).is('#divHoverGridResult')) {
            $('#divHoverGridResult').fadeOut(); // Using fadeOut for smooth disappearance
        }
    });
});





// To open the modal
document.getElementById("divHoverGridResult").style.display = "none";
