// Function to display current date and time in the registration date input
function displayDateTime() {
    var now = new Date();
    var dateTimeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    document.getElementById('dateOfRegistration').value = dateTimeString;
}

// Function to show the specified step and hide others
function showStep(step) {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    // Add more steps here if needed

    if (step === 1) {
        document.getElementById('step1').style.display = 'block';
    } else if (step === 2) {
        document.getElementById('step2').style.display = 'block';
    }
    // Add more steps here if needed
}

// Call the displayDateTime function when the page loads
window.onload = displayDateTime;

function showStep(step) {
    document.getElementById('step1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('step2').style.display = step === 2 ? 'block' : 'none';
    // Add more steps as needed
}

function showStep(step) {
    for (let i = 1; i <= 6; i++) {
        document.getElementById('step' + i).style.display = step === i ? 'block' : 'none';
    }

    if (step === 6) {
        displaySummary();
    }
}

function displaySummary() {
    const summaryDiv = document.getElementById('summary');
    const formData = new FormData(document.getElementById('staffForm'));
    let summaryHtml = '<h3>Summary</h3><ul>';

    formData.forEach((value, key) => {
        summaryHtml += `<li><strong>${key}:</strong> ${value}</li>`;
    });

    summaryHtml += '</ul>';
    summaryDiv.innerHTML = summaryHtml;
}

function submitForm() {
    // Here you can add your form submission logic
    alert('Form submitted successfully!');
}

function submitForm() {
    document.getElementById('staffForm').submit();
}
