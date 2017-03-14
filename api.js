// dependencies
const express = require('express');
const redis = require('redis');
const api = express();

api.post('/words.json', (req, res) => {

});

api.get('/anagrams/:word.json', (req, res) => {

});

api.delete('/words/:word.json', (req, res) => {

});

api.delete('/words.json', (req, res) => {

});

api.listen(3000);