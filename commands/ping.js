module.exports = {
    name: 'ping',
    description: 'Replies with Pong! and the latency.',
    async execute(interaction) {
        await interaction.reply({ content: 'Pinging...' });
        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong :ping_pong: ! Latency is \`${latency}ms\`.`);
    }
};
