const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createservice')
    .setDescription('Add a new service to the server')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the service')
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

    const serviceName = interaction.options.getString('name');

    if (data.services.includes(serviceName)) {
      return interaction.reply({ content: '⚠️ This service already exists.', ephemeral: true });
    }

    data.services.push(serviceName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Service \`${serviceName}\` created.`);
  }
};
