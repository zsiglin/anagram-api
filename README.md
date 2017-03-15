# Ibotta Dev Project
#### System Requirements:
- Ruby
- Node.js (>= v6.10)
- Redis
- yarn

#### Assumptions:
For the sake of brevity, I'm going to assume the user has at least the first three binaries above already present on their machine or knows how to get them. "yarn" can be installed via brew. `brew install yarn` It's a package manager that is quickly overtaking "npm".

#### Setup:
1. `cd` into `anagram-api`.
2. Type `yarn install` to install all dependencies.
3. Ensure Redis is running by executing `redis-server`
4. Run `yarn run api` to start the Express.js server
5. In a new terminal window run `yarn run tests` to execute the Ruby tests.
6. ?
7. Profit

In all seriousness, I'm sure the team sees a fair share of these projects with build issues. I'm happy to help troubleshoot if there are problems getting it up and going.

#### Comments:
I completed all of the required routes as well as three of the optional items below (with test coverage).

- Respect a query param for whether or not to include proper nouns in the list of anagrams
- Endpoint that takes a set of words and returns whether or not they are all anagrams of each other
- Endpoint to delete a word *and all of its anagrams*

#### Route Documentation:
* `POST /words.json`: Takes a JSON array of English-language words and adds them to the corpus (data store).

* `POST /word_list.json`: Takes a JSON array of words and returns whether they are all anagrams of each other.

* `GET /anagrams/:word.json`: Returns a JSON array of English-language words that are anagrams of the word passed in the URL. Supports two optional query params: (limit, exclude_proper_nouns).

* `DELETE /anagrams/:word.json`: Deletes a word and all of its anagrams from the store.

* `DELETE /words/:word.json`: Deletes a single word from the data store.

* `DELETE /words.json`: Deletes all contents of the data store.