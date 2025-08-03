const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate an alt account from a service')
    .addStringOption(option =>
      option.setName('service')
        .setDescription('Choose a service')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filePath = path.join(__dirname, '..', 'data', `${interaction.guild.id}.json`);

    if (!fs.existsSync(filePath)) {
      return interaction.respond([]);
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    const services = data.services || [];

    const filtered = services.filter(service => service.toLowerCase().includes(focusedValue.toLowerCase()));

    const choices = filtered.map(service => ({ name: service, value: service }));

    await interaction.respond(choices.slice(0, 25)); // max 25 choices
  },

  async execute(interaction) {
    const filePath = path.join(__dirname, '..', 'data', `${interaction.guild.id}.json`);
    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'Server data not initialized.', ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    const service = interaction.options.getString('service');

    if (!data.services.includes(service)) {
      return interaction.reply({ content: `❌ Service "${service}" does not exist.`, ephemeral: true });
    }

    if (!data.accounts || data.accounts.length === 0) {
      return interaction.reply({ content: '⚠️ No accounts available.', ephemeral: true });
    }

    const index = data.accounts.findIndex(acc => acc.service === service);
    if (index === -1) {
      return interaction.reply({ content: `⚠️ No accounts available for service "${service}".`, ephemeral: true });
    }

    const account = data.accounts[index].account;

    data.accounts.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    try {
      await interaction.user.send(`Here is your **${service}** account:\n\`\`\`${account}\`\`\``);
      await interaction.reply({ content: `${interaction.user}, I have sent you the account in DMs!`, ephemeral: true });
    } catch {
      await interaction.reply({ content: '❌ I could not DM you. Please check your privacy settings.', ephemeral: true });
    }
  }
};
