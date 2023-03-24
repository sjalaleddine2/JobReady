// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updateUserForm = document.getElementById('update-question-form-ajax');

// Modify the objects we need
updateUserForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProblem = document.getElementById("mySelect");
    let inputDifficulty = document.getElementById("update-difficulty");
    let inputQ_link = document.getElementById("update-q_link");

    // Get the values from the form fields
    let problemValue = inputProblem.value;
    let difficultyValue = inputDifficulty.value;
    let q_linkValue = inputQ_link.value;

    // Put our data we want to send in a javascript object
    let data = {
        problem: problemValue,
        difficulty: difficultyValue,
        q_link: q_linkValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-question-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, problemValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, questionID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("question-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == questionID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let tdDifficulty = updateRowIndex.getElementsByTagName("td")[2];
            let tdQ_link = updateRowIndex.getElementsByTagName("td")[3];
            
            tdDifficulty.innerHTML = parsedData[0].difficulty; 
            tdQ_link.innerHTML = parsedData[0].q_link; 
       }
    }
}

function updateInputs() {
    let selectQuestion = document.getElementById('mySelect');
    let selectQuestion_id = selectQuestion.value;

    if (selectQuestion_id === 'test') {
        document.getElementById('update-difficulty').value = ''
        document.getElementById('update-q_link').value = ''

    } else {
        let table = document.getElementById('question-table');

        for (let i = 0, row; row = table.rows[i]; i++) {
            console.log(table.rows[i].getAttribute('data-value'));
            if (table.rows[i].getAttribute('data-value') == selectQuestion_id) {
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                let td1 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('update-difficulty').value = td1.innerHTML;
                let td2 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('update-q_link').value = td2.innerHTML;
            }
        }
    }
}