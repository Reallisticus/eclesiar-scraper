const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
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
  {
    name: 'dailydamage',
    description: 'Display daily damage statistics',
    options: [
      {
        name: 'country',
        type: 3, // '3' represents string type
        description: 'The country you want to see damage for (optional)',
        required: false,
      },
      {
        name: 'day',
        type: 3, // '3' represents string type, can use a formatted date string
        description:
          'The specific day you want to see (optional, default is last day)',
        required: false,
      },
    ],
  },
];

// REST client to send the commands to Discord API
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

// Create the bot client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Register commands for each guild the bot is currently in
  for (const guild of client.guilds.cache.values()) {
    await registerGuildCommands(guild.id);
  }
});

client.on('guildCreate', async (guild) => {
  // Register commands when the bot joins a new server
  console.log(`Joined new guild: ${guild.name}`);
  await registerGuildCommands(guild.id);
});

// Function to register commands for a guild
async function registerGuildCommands(guildId) {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: commands }
    );
    console.log(`Successfully registered commands for guild ${guildId}`);
  } catch (error) {
    console.error(`Failed to register commands for guild ${guildId}:`, error);
  }
}

client.login(process.env.CLIENT_TOKEN);
