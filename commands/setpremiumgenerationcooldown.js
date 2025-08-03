const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpremiumgenerationcooldown')
    .setDescription('Set cooldown time (in minutes) for premium users')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Cooldown time in minutes')
        .setRequired(true)
        .setMinValue(0)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const time = interaction.options.getInteger('time');
    const filePath = path.join(__dirname, '..', 'data', `${interaction.guild.id}.json`);

    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'Server data not initialized.', ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    data.premiumCooldownMinutes = time;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Premium user cooldown set to ${time} minute(s).`);
  }
};
