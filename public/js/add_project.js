// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addProjectForm = document.getElementById('add-project-form-ajax');

// Modify the objects we need
addProjectForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("input-user_id");
    let inputDescription = document.getElementById("input-description");
    let inputLanguage = document.getElementById("input-language");
    let inputGit_link = document.getElementById("input-git_link");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let descriptionValue = inputDescription.value;
    let languageValue = inputLanguage.value;
    let git_linkValue = inputGit_link.value;

    // Put our data we want to send in a javascript object
    let data = {
        user_id: fullNameValue,
        description: descriptionValue,
        language: languageValue,
        github_link: git_linkValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-project-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFullName.value = '';
            inputDescription.value = '';
            inputLanguage.value = '';
            inputGit_link.value = '';
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
    let currentTable = document.getElementById("project-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let projectIdCell = document.createElement("TD");
    let fullNameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let languageCell = document.createElement("TD");
    let github_linkCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    projectIdCell.innerText = newRow.project_id;
    fullNameCell.innerText = newRow.full_name;
    descriptionCell.innerText = newRow.description;
    languageCell.innerText = newRow.language;
    github_linkCell.innerText = newRow.github_link;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteUser(newRow.project_id);
    };



    // Add the cells to the row 
    row.appendChild(projectIdCell);
    row.appendChild(fullNameCell);
    row.appendChild(descriptionCell);
    row.appendChild(languageCell);
    row.appendChild(github_linkCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.project_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.github_link;
    option.value = newRow.github_link;
    selectMenu.add(option);
    // End of new step 8 code.
}