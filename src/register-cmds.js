require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [
  {
    name: 'ping',
    description: 'Checks the current ping of the bot!',
  },
  {
    name: 'meme',
    description: 'Get a random meme!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.client_id),
      { body: commands }
    );

    console.clear();
    console.log('Initialised Successfully!');
  } catch (error) {
    console.error(`There was an error: ${error.message}`);
  }
})();
