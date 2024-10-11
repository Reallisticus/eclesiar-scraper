const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const WebSocket = require('ws'); // Assuming you use WebSocket to communicate with your Node.js backend
require('dotenv').config();
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const ws = new WebSocket('ws://localhost:3005'); // Your WebSocket endpoint

ws.on('open', () => {
  console.log('Connected to WebSocket server.');
});

ws.on('message', (message) => {
  console.log('Received message from server:', message);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const userInputs = new Map();

// Listen for interactions (commands)
client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'calculate') {
      // First modal (for first 5 inputs)
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

      const row1 = new ActionRowBuilder().addComponents(companyTypeInput);
      const row2 = new ActionRowBuilder().addComponents(inputNumberInput);
      const row3 = new ActionRowBuilder().addComponents(npcOwnerInput);
      const row4 = new ActionRowBuilder().addComponents(militaryBaseInput);
      const row5 = new ActionRowBuilder().addComponents(workersTodayInput);

      modal.addComponents(row1, row2, row3, row4, row5);

      // Show the modal to the user
      await interaction.showModal(modal);
    }
    if (interaction.commandName === 'scrapebattle') {
      const battleId = interaction.options.getString('battle_id');

      // Validate the battle ID
      if (!battleId || isNaN(battleId)) {
        await interaction.reply({
          content: 'Please provide a valid battle ID.',
          ephemeral: true,
        });
        return;
      }
      try {
        // Send the battle ID to the Node.js backend via HTTP POST
        const response = await axios.post(
          'http://localhost:3005/api/scrapeBattle',
          {
            battleId: battleId,
          }
        );

        // Check the response from the middleware
        if (response.data.success) {
          await interaction.reply({
            content: `Scraping initiated for battle ID: ${battleId}.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `Failed to initiate scraping: ${response.data.message}`,
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error('Error sending request to middleware:', error);
        await interaction.reply({
          content: 'An error occurred while initiating scraping.',
          ephemeral: true,
        });
      }
    }
  }

  // Handle the first modal submission
  if (
    interaction.type === InteractionType.ModalSubmit &&
    interaction.customId === 'calculateModalStep1'
  ) {
    // Collect first set of inputs
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

    // Store the values in a Map using the user's ID as the key
    userInputs.set(interaction.user.id, {
      companyType,
      inputNumber,
      npcOwner,
      militaryBase,
      workersToday,
    });

    // Create a button for the user to continue to the second step
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('showSecondModal')
        .setLabel('Continue to Step 2')
        .setStyle(ButtonStyle.Primary)
    );

    // Reply to the interaction with a message and the button
    await interaction.reply({
      content: 'Step 1 complete. Click the button below to continue to Step 2.',
      components: [row],
      ephemeral: true,
    });
  }

  // Add a new handler for the button interaction
  if (interaction.isButton() && interaction.customId === 'showSecondModal') {
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

    const row6 = new ActionRowBuilder().addComponents(ecoSkillInput);
    const row7 = new ActionRowBuilder().addComponents(regionBonusInput);
    const row8 = new ActionRowBuilder().addComponents(countryBonusInput);
    const row9 = new ActionRowBuilder().addComponents(pollutionDebuffInput);
    const row10 = new ActionRowBuilder().addComponents(productionFieldInput);

    modal2.addComponents(row6, row7, row8, row9, row10);

    // Show the second modal in response to the button click
    await interaction.showModal(modal2);
  }

  // Handle the second modal submission
  if (
    interaction.type === InteractionType.ModalSubmit &&
    interaction.customId === 'calculateModalStep2'
  ) {
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
      await interaction.reply(
        'Error: Could not find your previous inputs. Please start over.'
      );
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

    await interaction.reply(
      `Final production: ${result.finalProduction}, Raw consumed: ${result.rawConsumed}`
    );

    // Clear the stored inputs
    userInputs.delete(interaction.user.id);
  }
});

// Function to handle the formula calculations (same as before)
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

// Log In your bot
client.login(process.env.CLIENT_TOKEN);
