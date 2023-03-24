// Citation for the following page:
// Date: 12/05/2022
// Adapted from: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// App.js
/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8530;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript


/*
USERS
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/users', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.full_name === undefined)
    {
        query1 = "SELECT * FROM Users;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Users WHERE full_name LIKE "${req.query.full_name}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        res.render('users', {data: rows});
        })
    });


app.post('/add-user-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let gpa = parseFloat(data.gpa);
    if (isNaN(gpa))
    {
        gpa = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Users (full_name, language, university, gpa, location, linkedin) VALUES ('${data.fullname}', '${data.language}', '${data.uni}', ${gpa}, '${data.location}', '${data.linkedin}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT Users.user_id, Users.full_name, Users.language, Users.university, Users.gpa, Users.location, Users.linkedin FROM Users `;

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-user-ajax/', function(req,res,next){
  let data = req.body;
  let userID = parseInt(data.user_id);
  let deleteUser_Questions = `DELETE FROM Users_Questions WHERE user_id = ?`;
  let deleteUser_Classes = `DELETE FROM Users_Classes WHERE user_id = ?`;
  let deleteUser= `DELETE FROM Users WHERE user_id = ?`;


        // Run the 1st query
        db.pool.query(deleteUser_Classes, [userID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
            db.pool.query(deleteUser_Questions, [userID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
                else 
                {
                // Run the second query
                db.pool.query(deleteUser, [userID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
                }
            })
}})});


app.put('/put-user-ajax', function(req,res,next){                                   
  let data = req.body;

  let language = data.language;
  let user = data.fullname;
  let university = data.university;
  let gpa = parseFloat(data.gpa);
  let location = data.location;
  let linkedin = data.linkedin;

  queryUpdateAll = `UPDATE Users SET language = ?, university = ?, gpa = ?, location = ?, linkedin = ? WHERE user_id = ?`;
  selectUser = `SELECT * FROM Users WHERE user_id = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateAll, [language, university, gpa, location, linkedin, user], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectUser, [user], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


/*
QUESTIONS
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/questions', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.problem === undefined)
    {
        query1 = "SELECT * FROM Questions;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Questions WHERE problem LIKE "${req.query.problem}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        res.render('questions', {data: rows});
        })
    });


app.post('/add-question-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Questions (problem, difficulty, q_link) VALUES ('${data.problem}', '${data.difficulty}', '${data.q_link}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT Questions.question_id, Questions.problem, Questions.difficulty, Questions.q_link FROM Questions`;

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-question-ajax/', function(req,res,next){
  let data = req.body;
  let questionID = parseInt(data.question_id);
  let deleteUser_Questions = `DELETE FROM Users_Questions WHERE question_id = ?`;
  let deleteQuestion= `DELETE FROM Questions WHERE question_id = ?`;


        // Run the 1st query
        db.pool.query(deleteUser_Questions, [questionID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else 
            {
            // Run the second query
            db.pool.query(deleteQuestion, [questionID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            }
        })
});


app.put('/put-question-ajax', function(req,res,next){                                   
  let data = req.body;

  let question = data.problem;
  let difficulty = data.difficulty;
  let q_link = data.q_link;

  queryUpdateAll = `UPDATE Questions SET difficulty = ?, q_link = ? WHERE question_id = ?`;
  selectQuestion = `SELECT * FROM Questions WHERE question_id = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateAll, [difficulty, q_link, question], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectQuestion, [question], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


/*
PROJECTS
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/projects', function(req, res)
{
    // Declare Query 1
    let query1;
    let query2 = "SELECT Users.user_id, Users.full_name FROM Users;";

    // If there is no query string, we just perform a basic SELECT
    if (req.query.language === undefined)
    {
        query1 = "SELECT Projects.project_id, Projects.user_id, Users.full_name, Projects.description, Projects.language, Projects.github_link FROM Projects LEFT JOIN Users ON Users.user_id = Projects.user_id;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT Projects.project_id, Users.full_name, Projects.description, Projects.language, Projects.github_link FROM Projects LEFT JOIN Users ON Users.user_id = Projects.user_id WHERE Projects.language LIKE "${req.query.language}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error, rows1, fields){
        res.render('projects', {data: rows, data1: rows1});
        })}
)});


app.post('/add-project-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1;

    if (data.user_id === "")
    {
        query1 = `INSERT INTO Projects (description, language, github_link) VALUES ('${data.description}', '${data.language}', '${data.github_link}')`;
    }

    else
    {
        query1 = `INSERT INTO Projects (user_id, description, language, github_link) VALUES ('${data.user_id}','${data.description}', '${data.language}', '${data.github_link}')`;
    }

    // Create the query and run it on the database

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT Projects.project_id, Users.full_name, Projects.description, Projects.language, Projects.github_link FROM Projects LEFT JOIN Users ON Users.user_id = Projects.user_id;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-project-ajax/', function(req,res,next){
  let data = req.body;
  let projectID = parseInt(data.project_id);
  let deleteProject= `DELETE FROM Projects WHERE project_id = ?`;

        db.pool.query(deleteProject, [projectID], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
        }
    );


app.put('/put-project-ajax', function(req,res,next){                                   
  let data = req.body;

  let project = data.github_link;
  let user_id = data.fullname
  let description = data.description;
  let language = data.language;
  let queryUpdateAll = `UPDATE Projects SET user_id = ?, description = ?, language = ? WHERE project_id = ?`;


  if (user_id === "")
  {
    user_id = null

  }


  let selectProject = "SELECT Projects.project_id, Users.user_id, Users.full_name, Projects.description, Projects.language, Projects.github_link FROM Projects LEFT JOIN Users ON Users.user_id = Projects.user_id WHERE Projects.project_id = ?;";

        // Run the 1st query
        db.pool.query(queryUpdateAll, [user_id, description, language, project], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update
            // table on the front-end
            else
            {

                // Run the second query
                db.pool.query(selectProject, [project], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


/*
CLASSES
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/
app.get('/classes', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.class === undefined)
    {
        query1 = "SELECT * FROM Classes;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Classes WHERE name LIKE "${req.query.class}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        res.render('classes', {data: rows});
        })
    });


app.post('/add-class-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Classes (name) VALUES ('${data.name}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Classes`;

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-class-ajax/', function(req,res,next){
  let data = req.body;
  let classID = parseInt(data.class_id);
  let deleteUser_Classes = `DELETE FROM Users_Classes WHERE class_id = ?`;
  let deleteClass= `DELETE FROM Classes WHERE class_id = ?`;


        // Run the 1st query
        db.pool.query(deleteUser_Classes, [classID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else 
            {
            // Run the second query
            db.pool.query(deleteClass, [classID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            }
        })
});


/*
INTERNSHIPS
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/internships', function(req, res)
{
    // Declare Query 1
    let query1;
    let query2 = "SELECT Users.user_id, Users.full_name FROM Users;";

    // If there is no query string, we just perform a basic SELECT
    if (req.query.user_id === undefined)
    {
        query1 = "SELECT Internships.internship_id, Users.full_name, DATE_FORMAT(Internships.start_date, '%m/%d/%Y') AS start_date, DATE_FORMAT(Internships.end_date, '%m/%d/%Y') as end_date, Internships.company FROM Internships LEFT JOIN Users ON Users.user_id = Internships.user_id;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    // else
    // {
    //     query1 = `SELECT Internships.internship_id, Internships.user_id, Users.full_name, Internships.start_date, Internships.end_date, Internships.company FROM Internships LEFT JOIN Users ON Users.user_id = Internships.user_id WHERE Internships.user_id LIKE "${req.query.user_id}%"`
    // }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error, rows1, fields){
        res.render('internships', {data: rows, data1: rows1});
        })}
)});


app.post('/add-internship-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1 = `INSERT INTO Internships (user_id, start_date, end_date, company) VALUES ('${data.user_id}','${data.start_date}', '${data.end_date}', '${data.company}')`;

    // Create the query and run it on the database

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT Internships.internship_id, Users.full_name, DATE_FORMAT(Internships.start_date, '%m/%d/%Y') AS start_date, DATE_FORMAT(Internships.end_date, '%m/%d/%Y') as end_date, Internships.company FROM Internships LEFT JOIN Users ON Users.user_id = Internships.user_id;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-internship-ajax/', function(req,res,next){
  let data = req.body;
  let internshipID = parseInt(data.internship_id);
  let deleteInternship = `DELETE FROM Internships WHERE internship_id = ?`;

        db.pool.query(deleteInternship, [internshipID], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
        }
    );


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});



/*
USERS QUESTIONS
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/users-questions', function(req, res)
{
    // Declare Query 1
    let query1;
    let query2 = "SELECT Users.user_id, Users.full_name FROM Users;";
    let query3 = "SELECT Questions.question_id, Questions.problem FROM Questions;"

    // If there is no query string, we just perform a basic SELECT
    if (req.query.user_id === undefined || req.query.user_id === "")
    {
        query1 = "SELECT users_questions_id, full_name, problem FROM Users_Questions JOIN Users ON Users_Questions.user_id = Users.user_id JOIN Questions ON Users_Questions.question_id = Questions.question_id;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT users_questions_id, full_name, problem FROM Users_Questions JOIN Users ON Users_Questions.user_id = Users.user_id JOIN Questions ON Users_Questions.question_id = Questions.question_id WHERE Users_Questions.user_id LIKE "${req.query.user_id}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error, rows1, fields){
            db.pool.query(query3, function(error, rows2, fields){
        res.render('users-questions', {data: rows, data1: rows1, data2: rows2});
            })})}
)});


app.post('/add-users-questions-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1 = `INSERT INTO Users_Questions (Users_Questions.user_id, Users_Questions.question_id) VALUES ('${data.full_name}','${data.question}')`;

    // Create the query and run it on the database

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT users_questions_id, full_name, problem FROM Users_Questions JOIN Users ON Users_Questions.user_id = Users.user_id JOIN Questions ON Users_Questions.question_id = Questions.question_id;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-users-questions-ajax/', function(req,res,next){
  let data = req.body;
  let users_questions_ID = parseInt(data.users_questions_id);
  let deleteUsersQuestions= `DELETE FROM Users_Questions WHERE users_questions_id = ?`;

        db.pool.query(deleteUsersQuestions, [users_questions_ID], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
        }
    );


app.put('/put-users-questions-ajax', function(req,res,next){                                   
  let data = req.body;

  let user_question = data.users_questions_id;
  let user_id = data.fullname
  let question = data.question;
  let queryUpdateAll = `UPDATE Users_Questions SET user_id = ?, question_id = ? WHERE users_questions_id = ?`;

  let selectProject = "SELECT users_questions_id, full_name, problem FROM Users_Questions JOIN Users ON Users_Questions.user_id = Users.user_id JOIN Questions ON Users_Questions.question_id = Questions.question_id WHERE users_questions_id = ?;";

        // Run the 1st query
        db.pool.query(queryUpdateAll, [user_id, question, user_question], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update
            // table on the front-end
            else
            {

                // Run the second query
                db.pool.query(selectProject, [user_question], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});



/*
USERS CLASSES
--------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------
*/

app.get('/users-classes', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT users_classes_id, full_name, name FROM Users_Classes JOIN Users ON Users_Classes.user_id = Users.user_id JOIN Classes ON Users_Classes.class_id = Classes.class_id;";
    let query2 = "SELECT Users.user_id, Users.full_name FROM Users;";
    let query3 = "SELECT Classes.class_id, Classes.name FROM Classes;"

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error, rows1, fields){
            db.pool.query(query3, function(error, rows2, fields){
        res.render('users-classes', {data: rows, data1: rows1, data2: rows2});
            })})}
)});


app.post('/add-users-classes-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1 = `INSERT INTO Users_Classes (Users_Classes.user_id, Users_Classes.class_id) VALUES ('${data.full_name}','${data.class}')`;

    // Create the query and run it on the database

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT users_classes_id, full_name, name FROM Users_Classes JOIN Users ON Users_Classes.user_id = Users.user_id JOIN Classes ON Users_Classes.class_id = Classes.class_id;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-users-classes-ajax/', function(req,res,next){
  let data = req.body;
  let users_classes_ID = parseInt(data.users_classes_id);
  let deleteUsersClasses = `DELETE FROM Users_Classes WHERE users_classes_id = ?`;

        db.pool.query(deleteUsersClasses, [users_classes_ID], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
        }
    );