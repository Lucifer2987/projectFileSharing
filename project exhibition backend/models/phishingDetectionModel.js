const fs = require('fs');
const { parse } = require('arff');
const path = require('path');
const { RandomForestClassifier } = require('sklearn');

const phishingDatasetPath = path.join(__dirname, '../datasets/phishing_dataset.arff');

const trainPhishingModel = () => {
  const data = fs.readFileSync(phishingDatasetPath, 'utf8');
  const dataset = parse(data);
  const X = dataset.data.map((row) => row.slice(0, -1));
  const y = dataset.data.map((row) => row.slice(-1)[0]);

  const clf = new RandomForestClassifier();
  clf.fit(X, y);
  return clf;
};

module.exports = trainPhishingModel;
