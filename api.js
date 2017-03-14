// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const api = express();

// express middleware for JSON parsing
api.use(bodyParser.json());

api.post('/words.json', (req, res) => {

});

api.get('/anagrams/:word.json', (req, res) => {

});

api.delete('/words/:word.json', (req, res) => {

});

api.delete('/words.json', (req, res) => {

});

// start server on port 3000
api.listen(3000);