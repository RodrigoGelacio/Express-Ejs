// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");




// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

//require("./routes/apiRoutes")(app);


var tableData = require("./data/tableData");
var waitListData = require("./data/waitinglistData");


// Sets an initial port. We"ll use this later in our listener
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json())

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


//require("./routes/htmlRoutes")(app);
// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================


var tableData = require("./data/tableData");
var waitingListData = require("./data/waitinglistData");

app.get("/", (req, res) => {

  res.render('pages/home');

});

app.get("/reserve", (req, res) => {

  res.render('pages/reserve');

});

app.get("/tables", (req, res) => {


  res.render('pages/tables', { tableData, waitingListData });


});

app.get("/api/tables", function (req, res) {
  res.json(tableData);
});

app.get("/api/waitlist", function (req, res) {
  res.json(waitListData);
});

// API POST Requests
// Below code handles when a user submits a form and thus submits data to the server.
// In each of the below cases, when a user submits form data (a JSON object)
// ...the JSON is pushed to the appropriate JavaScript array
// (ex. User fills out a reservation request... this data is then sent to the server...
// Then the server saves the data to the tableData array)
// ---------------------------------------------------------------------------

app.post("/api/tables", function (req, res) {
  // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
  // It will do this by sending out the value "true" have a table
  // req.body is available since we're using the body parsing middleware
  if (tableData.length < 5) {
    console.log(req.body);
    tableData.push(req.body);
    res.json(true);
  }
  else {
    waitListData.push(req.body);
    res.json(false);
  }
});

// ---------------------------------------------------------------------------
// I added this below code so you could clear out the table while working with the functionality.
// Don"t worry about it!

app.post("/api/clear", function (req, res) {
  // Empty out the arrays of data
  tableData.length = 0;
  waitListData.length = 0;

  res.json({ ok: true });
});




// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
