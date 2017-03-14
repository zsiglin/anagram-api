'use strict';

// external dependencies
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

// local dependencies
const utils = require('./utils');
const AnagramList = require('./anagram-list-class');

// client instantiation
const api = express();
const redisClient = redis.createClient();

// express middleware for JSON parsing
api.use(bodyParser.json());

// adds words to the corpus
api.post('/words.json', (req, res) => {
    const words = req.body.words;
    let statusCode;
    
    if(words){
        words.forEach(word => redisClient.sadd(utils.standardizeKey(word), word));
        statusCode = 201;
    }

    res.sendStatus(statusCode || 400);
});

// fetches anagrams
api.get('/anagrams/:word.json', (req, res) => {
    const word = req.params.word;
    const limit = req.query.limit;
    const excludeProperNouns = (req.query.exclude_proper_nouns === 'true'); 

    redisClient.smembers(utils.standardizeKey(word), (err, anagrams) => {
        if(err) return res.sendStatus(500);

        let anagramList = new AnagramList(word, anagrams);

        if(excludeProperNouns){
            anagramList = anagramList.excludeProperNouns();
        }

        if(limit){
            anagramList = anagramList.limit(limit);
        }

        res.json({ anagrams });
    });
});

// deletes a word *and all of its anagrams*
api.delete('/anagrams/:word.json', (req, res) => {
    const { word } = req.params;

    redisClient.del(utils.standardizeKey(word));
    res.sendStatus(200);
});

// deletes a single word
api.delete('/words/:word.json', (req, res) => {
    const { word } = req.params;

    redisClient.srem(utils.standardizeKey(word), word);
    res.sendStatus(200);
});

// deletes all words
api.delete('/words.json', (req, res) => {
    redisClient.flushall();
    res.sendStatus(204);
});

// start server on port 3000
api.listen(3000);