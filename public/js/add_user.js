// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addUserForm = document.getElementById('add-user-form-ajax');

// Modify the objects we need
addUserForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("input-full_name");
    let inputLanguage = document.getElementById("input-language");
    let inputUniversity = document.getElementById("input-uni");
    let inputGPA = document.getElementById("input-gpa");
    let inputLocation = document.getElementById("input-location");
    let inputLinkedin = document.getElementById("input-linkedin");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let languageValue = inputLanguage.value;
    let universityValue = inputUniversity.value;
    let gpaValue = inputGPA.value;
    let locationValue = inputLocation.value;
    let linkedinValue = inputLinkedin.value;

    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        language: languageValue,
        uni: universityValue,
        gpa: gpaValue,
        location: locationValue,
        linkedin: linkedinValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFullName.value = '';
            inputLanguage.value = '';
            inputUniversity.value = '';
            inputGPA.value = '';
            inputLocation.value = '';
            inputLinkedin.value = '';
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
    let currentTable = document.getElementById("user-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let userIdCell = document.createElement("TD");
    let fullNameCell = document.createElement("TD");
    let languageCell = document.createElement("TD");
    let universityCell = document.createElement("TD");
    let gpaCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let linkedinCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    userIdCell.innerText = newRow.user_id;
    fullNameCell.innerText = newRow.full_name;
    languageCell.innerText = newRow.language;
    universityCell.innerText = newRow.university;
    gpaCell.innerText = newRow.gpa;
    locationCell.innerText = newRow.location;
    linkedinCell.innerText = newRow.linkedin;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteUser(newRow.user_id);
    };



    // Add the cells to the row 
    row.appendChild(userIdCell);
    row.appendChild(fullNameCell);
    row.appendChild(languageCell);
    row.appendChild(universityCell);
    row.appendChild(gpaCell);
    row.appendChild(locationCell);
    row.appendChild(linkedinCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.user_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.full_name;
    option.value = newRow.user_id;
    selectMenu.add(option);
    // End of new step 8 code.
}