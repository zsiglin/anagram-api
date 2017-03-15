'use strict';

class WordList{
    constructor(words){
        this.words = words;
    }

    areAnagrams(){
        const words = this.words.map(word => word.toLowerCase().split('').sort().join(''));

        return words.length > 1 && words.every(word => words[0] === word);
    }

    excludeProperNouns(){
        const words = this.words.filter(word => !/^[A-Z]/.test(word));

        return new WordList(words);
    }

    limit(number){
        const words = this.words.slice(0, number);

        return new WordList(words);
    }

    get(){
        return this.words;
    }
};

module.exports = WordList;