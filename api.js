const express = require('express');
const api = express();

api.get('/', (req, res) => {
    res.json({ test: 'woop' });
});



api.listen(3000);