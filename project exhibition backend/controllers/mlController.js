const trainMalwareModel = require('../models/malwareDetectionModel');
const trainPhishingModel = require('../models/phishingDetectionModel');
const trainAnomalyDetectionModel = require('../models/anomalyDetectionModel');

const malwareModel = trainMalwareModel();
const phishingModel = trainPhishingModel();
const anomalyModel = trainAnomalyDetectionModel();

const predictMalware = (req, res) => {
  const { features } = req.body;
  const prediction = malwareModel.predict([features]);
  res.json({ prediction });
};

const predictPhishing = (req, res) => {
  const { features } = req.body;
  const prediction = phishingModel.predict([features]);
  res.json({ prediction });
};

const detectAnomaly = (req, res) => {
  const { features } = req.body;
  const prediction = anomalyModel.predict([features]);
  res.json({ prediction });
};

module.exports = { predictMalware, predictPhishing, detectAnomaly };
