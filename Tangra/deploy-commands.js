const { REST, Routes } = require('discord.js');
require('dotenv').config();

// Define the command
const commands = [
  {
    name: 'calculate',
    description: 'Open a modal to calculate production',
  },
  {
    name: 'scrapebattle',
    description: 'Scrape battle data for a given battle ID',
    options: [
      {
        name: 'battle_id',
        type: 3, // '3' represents string type
        description: 'The ID of the battle you want to scrape',
        required: true,
      },
    ],
  },
];

// REST client to send the commands to Discord API
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

// Deploy the command (choose between global and guild-specific)
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Guild-specific deployment (useful for testing in one server)
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
