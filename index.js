const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

let lastState = {lastImageURL : ""};

const app = express();
const port = 8080;

let model = "s864-hackathon-zoldh--2";
let confidence = 0.7;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/setConfidence', (req, res) => {
    const body = req.body;
    let c = body.confidence;

    confidence = c;

    res.send('confidence is set to' + confidence);
});

app.post('/setModel', (req, res) => {
    const body = req.body;
    let m = body.model;

    model = m;

    res.send('model is set to' + model);
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
      url: "https://infer.roboflow.com/" + model,
      params: {
          access_token: "ebhLpNC3LtVc",
          image: imgUrl
      }
    })
    .then(function(response) {
      console.log(response.data);

      let predictions = response.data.predictions
      let accuratePredictions = predictions.filter(p=>p.confidence>confidence);
      let items = {};
      accuratePredictions.forEach(p => {
        if (items[p.class]) {
          items[p.class] = items[p.class] + 1;
        }
        else {
          items[p.class] = 1
        }
      });

      state.items = items;
      state.updated = new Date();
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
      url: "https://infer.roboflow.com/" + model,
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