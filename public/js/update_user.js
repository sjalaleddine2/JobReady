// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updateUserForm = document.getElementById('update-user-form-ajax');

// Modify the objects we need
updateUserForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputLanguage = document.getElementById("update-language");
    let inputUniversity = document.getElementById("update-uni");
    let inputGPA = document.getElementById("update-gpa");
    let inputLocation = document.getElementById("update-location");
    let inputLinkedin = document.getElementById("update-linkedin");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let languageValue = inputLanguage.value;
    let universityValue = inputUniversity.value;
    let gpaValue = inputGPA.value;
    let locationValue = inputLocation.value;
    let linkedinValue = inputLinkedin.value;
    
    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL

    // if (isNaN(languageValue), isNaN(universityValue), isNaN(locationValue), isNaN(linkedinValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        language: languageValue,
        university: universityValue,
        gpa: gpaValue,
        location: locationValue,
        linkedin: linkedinValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, userID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("user-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == userID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let tdLanguage = updateRowIndex.getElementsByTagName("td")[2];
            let tdUniversity = updateRowIndex.getElementsByTagName("td")[3];
            let tdGPA = updateRowIndex.getElementsByTagName("td")[4];
            let tdLocation = updateRowIndex.getElementsByTagName("td")[5];
            let tdLinkedin = updateRowIndex.getElementsByTagName("td")[6];
            
            tdLanguage.innerHTML = parsedData[0].language; 
            tdUniversity.innerHTML = parsedData[0].university; 
            tdGPA.innerHTML = parsedData[0].gpa; 
            tdLocation.innerHTML = parsedData[0].location; 
            tdLinkedin.innerHTML = parsedData[0].linkedin; 
       }
    }
}

function updateInputs() {
    let selectUser = document.getElementById('mySelect');
    let selectUser_id = selectUser.value;

    if (selectUser_id === 'test') {
        document.getElementById('update-language').value = ''
        document.getElementById('update-uni').value = ''
        document.getElementById('update-gpa').value = ''
        document.getElementById('update-location').value = ''
        document.getElementById('update-linkedin').value = ''

    } else {
        let table = document.getElementById('user-table');

        for (let i = 0, row; row = table.rows[i]; i++) {
            console.log(table.rows[i].getAttribute('data-value'));
            if (table.rows[i].getAttribute('data-value') == selectUser_id) {
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                let td1 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('update-language').value = td1.innerHTML;
                let td2 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('update-uni').value = td2.innerHTML;
                let td3 = updateRowIndex.getElementsByTagName("td")[4];
                document.getElementById('update-gpa').value = td3.innerHTML;
                let td4 = updateRowIndex.getElementsByTagName("td")[5];
                document.getElementById('update-location').value = td4.innerHTML;
                let td5 = updateRowIndex.getElementsByTagName("td")[6];
                document.getElementById('update-linkedin').value = td5.innerHTML;
            }
        }
    }
}