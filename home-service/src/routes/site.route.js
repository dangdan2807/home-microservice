const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('home');
});


router.get('/api/user/info', (req, res) => {
    return res.status(200).json({
    });
});

module.exports = router;