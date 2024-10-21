function calculateValues(inputs) {
  // The logic remains the same as before for all calculations.
  const {
    companyType,
    inputNumber,
    npcOwner,
    militaryBase,
    workersToday,
    ecoSkill,
    regionBonus,
    countryBonus,
    pollutionDebuff,
    productionFieldLevel,
    companyListedForSale,
  } = inputs;

  let baseValue;
  switch (companyType) {
    case 'raw':
      baseValue = [19, 39, 58, 78, 97][inputNumber - 1];
      break;
    case 'weapons':
      baseValue = [200, 164, 128, 92, 56][inputNumber - 1];
      break;
    case 'food':
      baseValue = [60, 49, 38, 27, 16][inputNumber - 1];
      break;
    case 'air-weapon':
      baseValue = [90, 73, 57, 41, 25][inputNumber - 1];
      break;
    case 'ticket':
      baseValue = [40, 32, 25, 18, 11][inputNumber - 1];
      break;
    default:
      return 'Invalid company type or input number';
  }

  let E3 = npcOwner === 'yes' ? baseValue / 3 : baseValue;
  let E4 =
    companyType === 'weapons' || companyType === 'air-weapon'
      ? militaryBase === 'yes'
        ? E3 * 1.05
        : E3
      : E3;
  let E5 = E4 * (1.3 - workersToday / 10);
  let E6 = Math.floor(E5 * (1 + ecoSkill / 50));
  let E7 = E6 + E6 * ((regionBonus + countryBonus) / 100);
  let E8 = E7 - (E7 - E7 * 0.1) * pollutionDebuff * 0.01;

  // Formula for production field/industrial zone level
  let E9;
  switch (productionFieldLevel) {
    case '0':
      E9 = E8 * 1;
      break;
    case '1':
      E9 = E8 * 1.05;
      break;
    case '2':
      E9 = E8 * 1.1;
      break;
    case '3':
      E9 = E8 * 1.15;
      break;
    case '4':
      E9 = E8 * 1.2;
      break;
    case '5':
      E9 = E8 * 1.25;
      break;
    default:
      E9 = 'Invalid production field level';
  }

  // Company listed for sale logic
  let rawConsumed;
  if (companyType === 'raw') {
    rawConsumed = 'not a product company';
  } else {
    rawConsumed = [37, 75, 112, 150, 187][inputNumber - 1];
  }

  // Adjust final production based on company sale status
  let finalProduction = companyListedForSale === 'yes' ? E9 / 2 : E9;

  // Return the production output and raw consumed
  return {
    finalProduction,
    rawConsumed,
  };
}

module.exports = calculateValues;
