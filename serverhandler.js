const fs = require('fs');
const path = require('path');

function handleNewGuild(guild) {
  const filePath = path.join(__dirname, 'data', `${guild.id}.json`);
  if (!fs.existsSync(filePath)) {
    const initialData = {
      guildName: guild.name,
      premiumRoleId: null,
      staffRoleId: null,
      accounts: [],
      services: [],
      regularCooldownMinutes: 10,
      premiumCooldownMinutes: 5
    };
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    console.log(`Created data file for ${guild.name} (${guild.id})`);
  }
}

module.exports = { handleNewGuild };
