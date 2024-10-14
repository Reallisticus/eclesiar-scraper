const RegionModel = require('../models/regionModel');

async function saveRegionData(data) {
  // Ensure the table exists
  await RegionModel.createTable();

  // Insert the region data into the table
  const regionData = {
    regionName: data.regionName || null,
    countryName: data.countryName || null,
    resourceType: data.resourceType || null,
    pollution: data.pollution || null,
    url: data.url || null,
  };

  await RegionModel.insert(regionData);
}

module.exports = {
  saveRegionData,
};
