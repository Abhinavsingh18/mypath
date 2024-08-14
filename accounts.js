document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("usernameInput").value = username;
        // Fetch branches based on the username
        fetch(`https://rssmarthut.com/mypath/fetchBranches.php?username=${username}`)
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

    document.getElementById("dateRangeFrom").addEventListener("change", validateDateRange);
    document.getElementById("dateRangeTo").addEventListener("change", validateDateRange);

    function validateDateRange() {
        const dateFrom = document.getElementById("dateRangeFrom").value;
        const dateTo = document.getElementById("dateRangeTo").value;

        if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
            alert("End date must be after start date.");
            document.getElementById("dateRangeTo").value = "";
        }
    }

    document.getElementById("Go").addEventListener("click", fetchIncome);
    document.getElementById("Button1").addEventListener("click", clearFields);

    document.getElementById("btnlastmonth").addEventListener("click", function () {
        setDateRange(-1); // Last month
    });
    document.getElementById("btnlast3month").addEventListener("click", function () {
        setDateRange(-3); // Last 3 months
    });
    document.getElementById("btnlast6month").addEventListener("click", function () {
        setDateRange(-6); // Last 6 months
    });
    document.getElementById("btnlast12month").addEventListener("click", function () {
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
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function fetchIncome() {
        // Get values from the select and input elements
        const branchname = document.getElementById('branchSelect').value;
        const username = document.getElementById('usernameInput').value;
        const dateRangeFrom = document.getElementById('dateRangeFrom').value;
        const dateRangeTo = document.getElementById('dateRangeTo').value;

        // Log the values to verify they are being fetched correctly
        console.log('branchname:', branchname);
        console.log('username:', username);
        console.log('dateRangeFrom:', dateRangeFrom);
        console.log('dateRangeTo:', dateRangeTo);

        fetch('https://rssmarthut.com/mypath/fetchIncome.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: username,
                branchname: branchname,
                dateRangeFrom: dateRangeFrom,
                dateRangeTo: dateRangeTo
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                document.getElementById('spanIncome').innerText = 'Error fetching income.';
            } else {
                document.getElementById('spanIncome').innerHTML = `<i class="fa fa-rupee"></i>${data.totalIncome}`;
            }
        })
        .catch(error => {
            console.error('Error fetching income:', error);
            document.getElementById('spanIncome').innerText = 'Error fetching income.';
        });
    }

    function clearFields() {
        document.getElementById("dateRangeFrom").value = "";
        document.getElementById("dateRangeTo").value = "";
        document.getElementById("branchSelect").value = "";
        document.getElementById("spanIncome").textContent = "₹0.00";
    }
});
