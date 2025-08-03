const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addstaffrole')
    .setDescription('Set the staff role for this server')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to set as staff')
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
    data.staffRoleId = role.id;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Staff role set to ${role.name}`);
  }
};
