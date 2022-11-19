const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
    console.log('site route');
    res.send('home');
});

module.exports = router;