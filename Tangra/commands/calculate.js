// src/commands/calculate.js
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} = require('discord.js');
const { calculateValues } = require('../utils/calculateValues');

const userInputs = new Map();

module.exports = {
  data: {
    name: 'calculate',
    description: 'Calculate production values',
  },
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('calculateModalStep1')
      .setTitle('Step 1: Basic Information');

    const companyTypeInput = new TextInputBuilder()
      .setCustomId('companyType')
      .setLabel('Company Type')
      .setPlaceholder('raw, weapons, food, ticket, air-weapon')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputNumberInput = new TextInputBuilder()
      .setCustomId('inputNumber')
      .setLabel('Input Number (1-5)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const npcOwnerInput = new TextInputBuilder()
      .setCustomId('npcOwner')
      .setLabel('NPC Owner? (yes/no)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const militaryBaseInput = new TextInputBuilder()
      .setCustomId('militaryBase')
      .setLabel('Military Base? (yes/no)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const workersTodayInput = new TextInputBuilder()
      .setCustomId('workersToday')
      .setLabel('# of Workers Today')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(companyTypeInput),
      new ActionRowBuilder().addComponents(inputNumberInput),
      new ActionRowBuilder().addComponents(npcOwnerInput),
      new ActionRowBuilder().addComponents(militaryBaseInput),
      new ActionRowBuilder().addComponents(workersTodayInput)
    );

    await interaction.showModal(modal);
  },
  async handleModalStep1(interaction) {
    const companyType = interaction.fields.getTextInputValue('companyType');
    const inputNumber = parseInt(
      interaction.fields.getTextInputValue('inputNumber')
    );
    const npcOwner = interaction.fields
      .getTextInputValue('npcOwner')
      .toLowerCase();
    const militaryBase = interaction.fields
      .getTextInputValue('militaryBase')
      .toLowerCase();
    const workersToday = parseFloat(
      interaction.fields.getTextInputValue('workersToday')
    );

    userInputs.set(interaction.user.id, {
      companyType,
      inputNumber,
      npcOwner,
      militaryBase,
      workersToday,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('showSecondModal')
        .setLabel('Continue to Step 2')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: 'Step 1 complete. Click the button below to continue to Step 2.',
      components: [row],
      ephemeral: true,
    });
  },
  async handleButton(interaction) {
    if (interaction.customId === 'showSecondModal') {
      const modal2 = new ModalBuilder()
        .setCustomId('calculateModalStep2')
        .setTitle('Step 2: More Information');

      const ecoSkillInput = new TextInputBuilder()
        .setCustomId('ecoSkill')
        .setLabel('Eco Skill')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const regionBonusInput = new TextInputBuilder()
        .setCustomId('regionBonus')
        .setLabel('Region Bonus')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const countryBonusInput = new TextInputBuilder()
        .setCustomId('countryBonus')
        .setLabel('Country Bonus')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const pollutionDebuffInput = new TextInputBuilder()
        .setCustomId('pollutionDebuff')
        .setLabel('Pollution Debuff')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const productionFieldInput = new TextInputBuilder()
        .setCustomId('productionFieldLevel')
        .setLabel('Production Field Level (0-5)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal2.addComponents(
        new ActionRowBuilder().addComponents(ecoSkillInput),
        new ActionRowBuilder().addComponents(regionBonusInput),
        new ActionRowBuilder().addComponents(countryBonusInput),
        new ActionRowBuilder().addComponents(pollutionDebuffInput),
        new ActionRowBuilder().addComponents(productionFieldInput)
      );

      await interaction.showModal(modal2);
    }
  },
  async handleModalStep2(interaction) {
    const ecoSkill = parseFloat(
      interaction.fields.getTextInputValue('ecoSkill')
    );
    const regionBonus = parseFloat(
      interaction.fields.getTextInputValue('regionBonus')
    );
    const countryBonus = parseFloat(
      interaction.fields.getTextInputValue('countryBonus')
    );
    const pollutionDebuff = parseFloat(
      interaction.fields.getTextInputValue('pollutionDebuff')
    );
    const productionFieldLevel = interaction.fields.getTextInputValue(
      'productionFieldLevel'
    );

    const storedValues = userInputs.get(interaction.user.id);
    if (!storedValues) {
      await interaction.reply({
        content:
          'Error: Could not find your previous inputs. Please start over.',
        ephemeral: true,
      });
      return;
    }

    const inputs = {
      ...storedValues,
      ecoSkill,
      regionBonus,
      countryBonus,
      pollutionDebuff,
      productionFieldLevel,
      companyListedForSale: 'no', // Default value
    };

    const result = calculateValues(inputs);

    await interaction.reply({
      content: `Final production: ${result.finalProduction.toFixed(
        2
      )}, Raw consumed: ${result.rawConsumed}`,
      ephemeral: true,
    });

    // Clear the stored inputs
    userInputs.delete(interaction.user.id);
  },
};
