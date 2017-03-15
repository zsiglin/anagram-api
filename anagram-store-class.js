class AnagramStore{
    constructor(redisClient){
        this.redisClient = redisClient;
    }

    addWords(words){
        words.forEach(word => this.redisClient.sadd(this.standardizeKey(word), word));
    }

    fetch(word){
        return new Promise((resolve, reject) => {
            this.redisClient.smembers(this.standardizeKey(word), (error, anagrams) => {
                error ? reject(error) : resolve(this.removeSelf(word, anagrams)); 
            });
        });
    }

    deleteAnagram(word){
        return this.redisClient.del(this.standardizeKey(word));
    }

    deleteWord(word){
        return this.redisClient.srem(this.standardizeKey(word), word);
    }

    deleteAll(){
        return this.redisClient.flushall();
    }

    // private
    standardizeKey(word){
        return word.toLowerCase().split('').sort().join('');
    }

    removeSelf(word, anagrams){
        const wordIndex = anagrams.indexOf(word);

        if(wordIndex !== -1){
            anagrams.splice(wordIndex, 1);   
        }

        return anagrams;
    }
};

module.exports = AnagramStore;