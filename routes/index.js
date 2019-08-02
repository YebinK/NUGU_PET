const express = require('express');
const nugu = require('../nugu');
const router = express.Router();

// router.post(`/nugu`, nugu);
router.post(`/nugu/answer.song`, nugu);

module.exports = router;
