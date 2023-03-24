// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
function deleteClass(classID) {
    // Put our data we want to send in a javascript object
    if (confirm("Are you sure you want to delete?") == false) {
      return
    }
    
    let data = {
        class_id: classID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(classID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(classID){

    let table = document.getElementById("class-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == classID) {
            table.deleteRow(i);
            break;
       }
    }
}
