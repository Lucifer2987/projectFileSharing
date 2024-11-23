const fs = require('fs');
const path = require('path');
const { IsolationForest } = require('sklearn');
const Papa = require('papaparse'); // Library for parsing CSV files

const anomalyDetectionDatasetPath = path.join(__dirname, '../datasets/ai4i_2020_dataset.csv');

const trainAnomalyDetectionModel = () => {
  const fileContent = fs.readFileSync(anomalyDetectionDatasetPath, 'utf8');
  
  // Parse CSV
  const { data } = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true
  });

  // Convert parsed data to numerical format
  const X = data.map((row) => Object.values(row).map(Number));

  const clf = new IsolationForest();
  clf.fit(X);
  return clf;
};

module.exports = trainAnomalyDetectionModel;
