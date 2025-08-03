const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addpremiumrole')
    .setDescription('Set the premium role for this server')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to set as premium')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const filePath = path.join(__dirname, '..', 'data', `${interaction.guild.id}.json`);

    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'Server data not initialized.', ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    data.premiumRoleId = role.id;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Premium role set to ${role.name}`);
  }
};
