const express = require('express');
const router = express.Router();
const { generateAd, getHistory, downloadCampaignImage, deleteCampaign, remixCampaign } = require('../controllers/adController');

router.post('/generate', generateAd);
router.post('/remix/:id', remixCampaign);
router.get('/history', getHistory);
router.get('/download/:id', downloadCampaignImage);
router.delete('/:id', deleteCampaign);

module.exports = router;
