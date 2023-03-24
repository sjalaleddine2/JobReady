// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addQuestionForm = document.getElementById('add-question-form-ajax');

// Modify the objects we need
addQuestionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProblem = document.getElementById("input-problem");
    let inputDifficulty = document.getElementById("input-difficulty");
    let inputQ_link = document.getElementById("input-q_link");

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
    xhttp.open("POST", "/add-question-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputProblem.value = '';
            inputDifficulty.value = '';
            inputQ_link.value = '';
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
    let currentTable = document.getElementById("question-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let questionIdCell = document.createElement("TD");
    let problemCell = document.createElement("TD");
    let difficultyCell = document.createElement("TD");
    let q_linkCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    questionIdCell.innerText = newRow.question_id;
    problemCell.innerText = newRow.problem;
    difficultyCell.innerText = newRow.difficulty;
    q_linkCell.innerText = newRow.q_link;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteQuestion(newRow.question_id);
    };



    // Add the cells to the row 
    row.appendChild(questionIdCell);
    row.appendChild(problemCell);
    row.appendChild(difficultyCell);
    row.appendChild(q_linkCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.question_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.problem;
    option.value = newRow.question_id;
    selectMenu.add(option);
}