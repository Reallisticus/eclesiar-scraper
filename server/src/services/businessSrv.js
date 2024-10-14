const BusinessDataModel = require('../models/businessModel');

async function saveBusinessData(data) {
  // Ensure the table exists
  await BusinessDataModel.createTable();

  // Insert the business data into the database
  await BusinessDataModel.insert(data);
}

module.exports = {
  saveBusinessData,
};
