const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addalt')
    .setDescription('Add an alt account under a service')
    .addStringOption(option =>
      option.setName('service')
        .setDescription('The service this account belongs to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Username of the alt account')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('password')
        .setDescription('Password of the alt account')
        .setRequired(true)
    ),

  async execute(interaction) {
    const filePath = path.join(__dirname, '..', 'data', `${interaction.guild.id}.json`);
    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'Server data not initialized.', ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    const staffRoleId = data.staffRoleId;
    if (!staffRoleId || !interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: '❌ You must have the staff role to use this command.', ephemeral: true });
    }

    const service = interaction.options.getString('service');
    if (!data.services.includes(service)) {
      return interaction.reply({ content: `❌ Service "${service}" does not exist.`, ephemeral: true });
    }

    const username = interaction.options.getString('username');
    const password = interaction.options.getString('password');
    const accountEntry = `${username}:${password}`;

    if (!data.accounts) data.accounts = [];

    data.accounts.push({
      service,
      account: accountEntry
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Added account to service "${service}".`);
  }
};
