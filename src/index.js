require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js'); 
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, '../commands', file));
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'dnd',
        activities: [{ name: 'Random Memes 😂', type: 'WATCHING' }],
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error('Error in command execution:', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bot messages

    const prefix = '!';
    if (!message.content.startsWith(prefix)) return; // Ignore messages without the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        if (command.executeMessage) {
            await command.executeMessage(message, client); // Call `executeMessage` for text commands
        } else {
            await message.reply('This command is only available as a slash command.');
        }
    } catch (error) {
        console.error('Error in message command execution:', error);
        await message.reply('There was an error while executing this command!');
    }
});


client.login(process.env.token);