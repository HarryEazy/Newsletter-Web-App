//jshint esversion:8

const express = require("express");

// retired from Jan 2020 use https
const request = require("request");

const https = require("https");

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


app.post("/", function(req, res) {
  let firstName = req.body.fname;
  let lastName = req.body.sname;
  let email = req.body.email;

  // will convert this to JSON format to send to API
  let data = {
    members: [
      {
      // users email adress
      email_address: email,
      // status of user - can also be unsubscribed
      status: "subscribed",
      // merge_fields is used for first name and last name
      // can be changed in mailchimp audience settings to another name if prefer
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }

      }
    ]
  };

  // convert data into JSON using JSON.stringify
  let jsonData = JSON.stringify(data);

  // create options object to send with function reuest
  let options = {

    // url got API includes the server us4 & list ID at the end
    url: "https://us4.api.mailchimp.com/3.0/lists/694f47de3c",

    // Change default method from request to post
    method: "POST",

    // need http basic authorization using node & request
    // first string can be any string second has to be API key
    // has to be in headers object
    headers: {
      "Authorization": ""
    },
    // the actual content that we are posting in JSON format
    body: jsonData

  };

  request(options, function(error, response, body) {
    if (error){
      res.sendFile(__dirname + "/failure.html");

    }
    if (response.statusCode !== 200){

      res.sendFile(__dirname + "/failure.html");

    } else {

      res.sendFile(__dirname + "/success.html");
    }




  });

});

// if try again button pressed on failure page
// send user back to sign up page
app.post("/failure", function(req, res) {
  res.redirect("/");


});

// put all static files here for server to load
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// deploying on heroku use process.env.PORT
// this is a dynamic port
// add or "||" so we can still test locally on localhost:3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running on localhost:3000");
});

//audience
//694f47de3c

// api key
//9d1f3f6bafa7009f7e38a63e29a8e6ba-us4
