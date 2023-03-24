// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addInternshipForm = document.getElementById('add-internship-form-ajax');

// Modify the objects we need
addInternshipForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("input-user_id");
    let inputStart_date = document.getElementById("input-start_date");
    let inputEnd_date = document.getElementById("input-end_date");
    let inputCompany = document.getElementById("input-company");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let start_dateValue = inputStart_date.value;
    let end_dateValue = inputEnd_date.value;
    let companyValue = inputCompany.value;

    // Put our data we want to send in a javascript object
    let data = {
        user_id: fullNameValue,
        start_date: start_dateValue,
        end_date: end_dateValue,
        company: companyValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-internship-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFullName.value = '';
            inputStart_date.value = '';
            inputEnd_date.value = '';
            inputCompany.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("internship-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let internshipIdCell = document.createElement("TD");
    let fullNameCell = document.createElement("TD");
    let start_dateCell = document.createElement("TD");
    let end_dateCell = document.createElement("TD");
    let companyCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    internshipIdCell.innerText = newRow.internship_id;
    fullNameCell.innerText = newRow.full_name;
    start_dateCell.innerText = newRow.start_date;
    end_dateCell.innerText = newRow.end_date;
    companyCell.innerText = newRow.company;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteInternship(newRow.internship_id);
    };



    // Add the cells to the row 
    row.appendChild(internshipIdCell);
    row.appendChild(fullNameCell);
    row.appendChild(start_dateCell);
    row.appendChild(end_dateCell);
    row.appendChild(companyCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.project_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
}