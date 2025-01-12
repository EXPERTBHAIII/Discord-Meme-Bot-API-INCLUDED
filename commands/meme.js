const { EmbedBuilder, Collection } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cooldowns = new Collection();
let api = "http://217.160.125.126:9287"

module.exports = {
    name: 'meme',
    async execute(interaction, client) {
        if (cooldowns.has(interaction.user.id)) {
            await interaction.reply('You are on cooldown! Please wait before using this command again.');
            return;
        }

        cooldowns.set(interaction.user.id, true);
        setTimeout(() => cooldowns.delete(interaction.user.id), 10000);

        try {
            await interaction.deferReply();
            const { data, fileExtension, websiteTitle } = await getMeme();

            const memeEmbed = new EmbedBuilder()
                .setTitle(`${websiteTitle}`)
                .setImage(`attachment://meme.${fileExtension}`)
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

            const reply = await interaction.editReply({ embeds: [memeEmbed], files: [{ attachment: data, name: `meme.${fileExtension}` }] });
            await reply.react('😂');
        } catch (error) {
            console.error('Error replying with meme:', error);
            await interaction.editReply('Failed to fetch a meme. Please try again later.');
        }
    },

    async executeMessage(message, client) {
        if (cooldowns.has(message.author.id)) {
            await message.reply('You are on cooldown! Please wait before using this command again.');
            return;
        }

        cooldowns.set(message.author.id, true);
        setTimeout(() => cooldowns.delete(message.author.id), 5000);

        try {
            const { data, fileExtension, websiteTitle } = await getMeme();

            const memeEmbed = new EmbedBuilder()
                .setTitle(`${websiteTitle}`)
                .setImage(`attachment://meme.${fileExtension}`)
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

            const reply = await message.reply({ embeds: [memeEmbed], files: [{ attachment: data, name: `meme.${fileExtension}` }] });

            await reply.react('😂');
        } catch (error) {
            console.error('Error processing the request:', error);
            await message.reply('There was an issue with processing your request. Please try again later.');
        }
    }
};

async function getMeme() {
    try {
        const response = await axios.get(`${api}`, {
            responseType: 'text',
        });

        const html = response.data.toString();
        const $ = cheerio.load(html);

        const websiteTitle = $('title').text();
        const imgUrl = $('img').attr('src');

        if (!imgUrl) {
            throw new Error('Image URL not found in HTML.');
        }

        const imageResponse = await axios.get(imgUrl, {
            responseType: 'arraybuffer',
        });

        const contentType = imageResponse.headers['content-type'];
        let fileExtension = 'png';
        if (contentType === 'image/gif') fileExtension = 'gif';
        if (contentType === 'image/jpeg') fileExtension = 'jpg';

        return { data: imageResponse.data, fileExtension, websiteTitle };
    } catch (error) {
        console.error('Error fetching meme:', error);
        throw error;
    }
}
