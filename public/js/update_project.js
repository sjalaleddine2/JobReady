// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updateProjectForm = document.getElementById('update-project-form-ajax');

// Modify the objects we need
updateProjectForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGithub_link = document.getElementById("mySelect");
    let inputFullName = document.getElementById("update-user_id");
    let inputDescription = document.getElementById("update-description");
    let inputLanguage = document.getElementById("update-language");
 
    // Get the values from the form fields
    let github_linkValue = inputGithub_link.value;
    let fullNameValue = inputFullName.value;
    let descriptionValue = inputDescription.value;
    let languageValue = inputLanguage.value;
    
    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL

    // if (isNaN(languageValue), isNaN(universityValue), isNaN(locationValue), isNaN(linkedinValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        github_link: github_linkValue,
        fullname: fullNameValue,
        description: descriptionValue,
        language: languageValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-project-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, github_linkValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, github_link){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("project-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == github_link) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let tdFullName = updateRowIndex.getElementsByTagName("td")[1];
            let tdDescription = updateRowIndex.getElementsByTagName("td")[2];
            let tdLanguage = updateRowIndex.getElementsByTagName("td")[3];
            
            tdFullName.innerHTML = parsedData[0].full_name; 
            tdDescription.innerHTML = parsedData[0].description; 
            tdLanguage.innerHTML = parsedData[0].language;  
       }
    }
}

function updateInputs() {
    let selectProject = document.getElementById('mySelect');
    let selectProject_id = selectProject.value;

    if (selectProject_id === 'test') {
        document.getElementById('update-user_id').value = ''
        document.getElementById('update-description').value = ''
        document.getElementById('update-language').value = ''

    } else {
        let table = document.getElementById('project-table');

        for (let i = 0, row; row = table.rows[i]; i++) {
            console.log(table.rows[i].getAttribute('data-value'));
            if (table.rows[i].getAttribute('data-value') == selectProject_id) {
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                let td2 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('update-description').value = td2.innerHTML;
                let td3 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('update-language').value = td3.innerHTML;
            }
        }
    }
}