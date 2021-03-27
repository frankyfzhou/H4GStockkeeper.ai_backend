const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

let lastState = {lastImageURL : ""};

const app = express();
const port = 8080;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/book', (req, res) => {
    const book = req.body;

    // Output the book to the console for debugging
    console.log(book);
    books.push(book);

    res.send('Book is added to the database');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


app.get('/lastState', (req, res) => {
    res.send(lastState);
});

app.post('/sendimage', (req, res) => {
    debugger;
    const body = req.body;
    let imgUrl = body.imageurl;
    
    let state = {lastImageURL:imgUrl};
    
    axios({
      method: "POST",
      url: "https://infer.roboflow.com/s864-hackathon-zoldh--2",
      params: {
          access_token: "ebhLpNC3LtVc",
          image: imgUrl
      }
    })
    .then(function(response) {
      console.log(response.data);

      let predictions = response.data.predictions
      let accuratePredictions = predictions.filter(p=>p.confidence>0.1);
      accuratePredictions.array.forEach(p => {
        if (state[p.class]) {
          state[p.class] = state[p.class] + 1;
        }
        else {
          state[p.class] = 1
        }
      });
      lastState = state;

      res.send(response.data);
    })
    .catch(function(error) {
      console.log(error.message);
      res.send(error.message);
    });
});

app.post('/testimage', (req, res) => {
    debugger;
    const body = req.body;
    let imgUrl = body.imageurl;
    
    axios({
      method: "POST",
      url: "https://infer.roboflow.com/s864-hackathon-zoldh--2",
      params: {
          access_token: "ebhLpNC3LtVc",
          image: imgUrl
      }
    })
    .then(function(response) {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(function(error) {
      console.log(error.message);
      res.send(error.message);
    });
});