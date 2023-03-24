// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updateUsersQuestionsForm = document.getElementById('update-users-questions-form-ajax');

// Modify the objects we need
updateUsersQuestionsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUsers_Questions_ID = document.getElementById("mySelect");
    let inputFullName = document.getElementById("update-user_id");
    let inputQuestion = document.getElementById("update-question");
 
    // Get the values from the form fields
    let usersquestions_idValue = inputUsers_Questions_ID.value;
    let fullNameValue = inputFullName.value;
    let questionValue = inputQuestion.value;
    
    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL

    // if (isNaN(languageValue), isNaN(universityValue), isNaN(locationValue), isNaN(linkedinValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        users_questions_id: usersquestions_idValue,
        fullname: fullNameValue,
        question: questionValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-users-questions-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, usersquestions_idValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, users_questions_ID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("users-questions-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == users_questions_ID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let tdFullName = updateRowIndex.getElementsByTagName("td")[1];
            let tdQuestion = updateRowIndex.getElementsByTagName("td")[2];
            
            tdFullName.innerHTML = parsedData[0].full_name; 
            tdQuestion.innerHTML = parsedData[0].problem; 
       }
    }
}