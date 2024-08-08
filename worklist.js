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
        }
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

                data.forEach(patient => {
                    const row = $("<tr>");
                    row.append(`<td>${patient.id}</td>`);
                    row.append(`<td>${patient.pid}</td>`);
                    row.append(`<td>${patient.patientname}</td>`);
                    row.append(`<td>${patient.advisedDate.split(' ')[0]}</td>`);
                    row.append(`<td>${patient.advisedByDoctor}</td>`);
                    row.append(`<td>${patient.advisedByFacility}</td>`);
                    row.append(`<td>${patient.referredBy}</td>`);
                    const selectedTestsArray = JSON.parse(patient.selectedTests);
                    const totalPrice = selectedTestsArray.reduce((sum, test) => sum + parseFloat(test.price), 0);
                    row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                    row.append(`<td>0</td>`);
                    row.append(`<td>0</td>`);
                    row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                    row.append(`<td>${totalPrice.toFixed(2)}</td>`);
                    tableBody.append(row);

                    row.on("click", function () {
                        if ($(this).next(".k-detail-row").length) {
                            $(this).next(".k-detail-row").toggle();
                        } else {
                            const detailRow = $("<tr>").addClass("k-detail-row k-alt");
                            const detailCell = $("<td>").addClass("k-detail-cell").attr("colspan", "12");
                            const selectedTestsHTML = selectedTestsArray.map(test => `
                                <tr data-testdetail="testDetail" class="purple k-state-selected">
                                    <td style="width:200px">${test.testname}</td>
                                    <td><a class="reportNumber" tabindex="0" style="color:red" data-patientname="${patient.patientname}" data-adviseddate="${patient.advisedDate}" data-testname="${test.testname}" data-gender="${patient.gender}" data-age="${patient.age}">${test.REPORTNUMBER}</a></td>
                                    <td style="width:160px">${patient.advisedDate.split(' ')[0]}</td>
                                    <td style="width:80px;"></td>
                                    <td></td>
                                    <td>default</td>
                                </tr>
                            `).join('');
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
                                                <col>
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
                        }
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + " - " + error);
            }
        });
    }

    // Handle clicks on report number links
    $(document).on('click', '.reportNumber', function (event) {
        event.preventDefault();

        var reportNumber = $(this).text().trim();
        var patientName = $(this).data('patientname');
        var advisedDate = $(this).data('adviseddate');
        var testName = $(this).data('testname');
        var gender = $(this).data('gender');
        var age = $(this).data('age');
        var branchName = $(".branch-checkbox:checked").next("label").text(); // Get the branch name

        $('#hoverResultSrNo').text(reportNumber);
        $('#hoverTestName').text(testName);
        $('#hoverPatientName').text(patientName);
        $('#hoverAdvisedDate').text(advisedDate);
        $('#hovergender').text(gender);
        $('#hoverage').text(age);

        // Fetch range data and display it
        fetchRangeData(testName, age, gender, branchName);

        $('#divHoverGridResult').fadeIn(); // Open the modal
    });

    // Close modal functionality
    $('#MainContent_LISInvestigationWorkListControl_btnResultClose').click(function () {
        $('#divHoverGridResult').fadeOut(); // Close the modal
    });

    $(window).click(function (event) {
        if ($(event.target).is('#divHoverGridResult')) {
            $('#divHoverGridResult').fadeOut(); // Close the modal when clicking outside
        }
    });

    // Fetch range data
// Fetch range data
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

            // <p><strong>Comment:</strong> ${entry.comment || 'N/A'}</p>
                    
            // <div><p> ${entry.comment || 'N/A'}</p></div>

            let rangeDescription = "";
            data.forEach(entry => {
                const rangeInfo = `
                    <p style="width:18vw"> ${entry.range_name || 'N/A'}</p>
                    <p style="width:6vw"> ${entry.unit || 'N/A'}</p>
                    <p style="width:7.3vw"> ${entry.type || 'N/A'}</p>
                    <p style="width:7.9vw">
                        <span style="background-color:red;color:white;padding-left:4px;padding-right:4px;border-radius:3px">${entry.critical_low || 'N/A'}</span>
                        <span style="background-color:#25a0ff;padding-left:4px;padding-right:4px;color:white;border-radius:3px">${entry.range_from || 'N/A'} - ${entry.range_to || 'N/A'}</span>
                        <span style="background-color:red;color:white;padding-left:4px;padding-right:4px;border-radius:3px">${entry.critical_high || 'N/A'}</span>
                    </p>
                    <p style="width:19.8vw"><input type="text" placeholder="Report Value" style="border=none;border-radius:3px;border:none;margin-bottom:5.4px"></p>
                    <p style="width:12vw"><input type="text" placeholder="Remark" style="border=none;border-radius:3px;border:none;margin-bottom:5.4px"></p>
                    
                   
                  
                 
                `;
                rangeDescription += rangeInfo;
            });

            $('#rangeDescription').html(rangeDescription);
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
        }
    });
}



});
