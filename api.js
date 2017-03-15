'use strict';

// external dependencies
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

// local dependencies
const AnagramStore = require('./anagram-store-class');
const WordList = require('./word-list-class');

// client instantiation
const api = express();
const redisClient = redis.createClient();
const anagramStore = new AnagramStore(redisClient);

// express middleware for JSON parsing
api.use(bodyParser.json({ limit: '50mb' }));

// adds words to the store
api.post('/words.json', (req, res) => {
    const { words } = req.body;
    let statusCode;
    
    if(words){
        anagramStore.addWords(words);
        statusCode = 201;
    }

    res.sendStatus(statusCode || 400);
});

// checks if words that are passed in are anagrams
api.post('/word_list.json', (req, res) => {
    const { words } = req.body;

    let wordList = new WordList(words);
    res.json({ anagrams: wordList.areAnagrams() });
});

// fetches anagrams from the store
api.get('/anagrams/:word.json', (req, res) => {
    const word = req.params.word;
    const limit = req.query.limit;
    const excludeProperNouns = (req.query.exclude_proper_nouns === 'true');

    anagramStore.fetch(word).then((anagrams) => {
        let wordList = new WordList(anagrams);

        wordList = excludeProperNouns ? wordList.excludeProperNouns() : wordList;
        wordList = limit ? wordList.limit(limit) : wordList;

        res.json({ anagrams: wordList.get() });
    }).catch(() => {
        res.sendStatus(500);
    });
});

// deletes a word *and all of its anagrams* from the store
api.delete('/anagrams/:word.json', (req, res) => {
    const { word } = req.params;

    anagramStore.deleteAnagram(word);
    res.sendStatus(200);
});

// deletes a single word from the store
api.delete('/words/:word.json', (req, res) => {
    const { word } = req.params;

    anagramStore.deleteWord(word);
    res.sendStatus(200);
});

// deletes all words from the store
api.delete('/words.json', (req, res) => {
    anagramStore.deleteAll();
    res.sendStatus(204);
});

// start server on port 3000
api.listen(3000);