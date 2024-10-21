const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const calculateCommand = require('./commands/calculate');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Listen for interactions (commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (interaction.isCommand()) {
    if (commandName === 'calculate') {
      await calculateCommand.execute(interaction);
    }
    if (commandName === 'scrapebattle') {
      await scrapeBattleCommand.execute(interaction);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'calculateModalStep1') {
      await calculateCommand.handleModalStep1(interaction);
    } else if (interaction.customId === 'calculateModalStep2') {
      await calculateCommand.handleModalStep2(interaction);
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === 'showSecondModal') {
      await calculateCommand.handleButton(interaction);
    }
  }
});

client.login(process.env.CLIENT_TOKEN);
