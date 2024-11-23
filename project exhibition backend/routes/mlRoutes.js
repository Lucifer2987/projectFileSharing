const express = require('express');
const { predictMalware, predictPhishing, detectAnomaly } = require('../controllers/mlController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/malware', authMiddleware, predictMalware);
router.post('/phishing', authMiddleware, predictPhishing);
router.post('/anomaly', authMiddleware, detectAnomaly);

module.exports = router;
