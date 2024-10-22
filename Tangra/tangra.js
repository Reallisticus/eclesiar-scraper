const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const calculateCommand = require('./commands/calculate');
const scrapeBattleCommand = require('./commands/scrapeBattle');
const dailyDamageCommand = require('./commands/dailydamage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for interactions (commands)
client.on('interactionCreate', async (interaction) => {
  console.log(`Interaction created: ${interaction.type}`);

  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (interaction.isCommand()) {
    console.log(`Command received: ${interaction.commandName}`);

    if (commandName === 'calculate') {
      console.log('Executing calculate command...');

      await calculateCommand
        .execute(interaction)
        .then(() => console.log('Calculate command executed successfully.'))
        .catch((err) =>
          console.error('Error executing calculate command:', err)
        );
    }
    if (commandName === 'scrapebattle') {
      console.log('Executing scrapeBattle command...');

      await scrapeBattleCommand
        .execute(interaction)
        .then(() => console.log('ScrapeBattle command executed successfully.'))
        .catch((err) =>
          console.error('Error executing scrapeBattle command:', err)
        );
    }
    if (commandName === 'dailydamage') {
      console.log('Executing dailydamage command...');
      await dailyDamageCommand
        .execute(interaction)
        .then(() => console.log('Daily dmg command executed successfully.'))
        .catch((err) =>
          console.error('Error executing scrapeBattle command:', err)
        );
    }
  } else if (interaction.isModalSubmit()) {
    console.log(`Modal submit received: ${interaction.customId}`);

    if (interaction.customId === 'calculateModalStep1') {
      console.log('Handling calculateModalStep1...');

      await calculateCommand
        .handleModalStep1(interaction)
        .then(() =>
          console.log('Step 1 of calculateModal handled successfully.')
        )
        .catch((err) =>
          console.error('Error handling calculateModalStep1:', err)
        );
    } else if (interaction.customId === 'calculateModalStep2') {
      console.log('Handling calculateModalStep2...');

      await calculateCommand
        .handleModalStep2(interaction)
        .then(() =>
          console.log('Step 2 of calculateModal handled successfully.')
        )
        .catch((err) =>
          console.error('Error handling calculateModalStep2:', err)
        );
    }
  } else if (interaction.isButton()) {
    console.log(`Button interaction received: ${interaction.customId}`);

    if (interaction.customId === 'showSecondModal') {
      await calculateCommand
        .handleButton(interaction)
        .then(() => console.log('Button interaction handled successfully.'))
        .catch((err) =>
          console.error('Error handling button interaction:', err)
        );
    }
  }
});

client
  .login(process.env.CLIENT_TOKEN)
  .then(() => console.log('Bot logged in successfully.'))
  .catch((err) => console.error('Failed to log in:', err));
