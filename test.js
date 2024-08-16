let selectedTestsArray=[
    {
        testname: "ACID PHOSPHATASE",
        price: "30",
        REPORTNUMBER: 202411
    },
    {
        testname: "A/G RATIO",
        price: "20",
        REPORTNUMBER: 202412
    },
    {
        testname: "ALBUMIN FLUID",
        price: "40",
        REPORTNUMBER: 202413
    }
]
    selectedTestsArray.forEach((test)=>{
        checkReportNumberAvailability(test.REPORTNUMBER)

    })

    function checkReportNumberAvailability(reportNumber) {
        $.ajax({
            url: "https://rssmarthut.com/mypath/checkReportNumber.php",
            type: "GET",
            data: { reportNumber: reportNumber },
            dataType: "json",
            success: function (data) {
                console.log(data)
                if (data.exists) {
                    // Show the print button if report number exists
                    console.log(`${reportNumber} exists`)
                    // $(".k-detail-row").last().find(".print-button").show();
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            },
        });
    }