const fs = require('fs');
const path = require('path');

function handleNewGuild(guild) {
  const filePath = path.join(__dirname, 'data', `${guild.id}.json`);
  if (!fs.existsSync(filePath)) {
    const initialData = {
      guildName: guild.name,
      accounts: []
    };
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    console.log(`Created data file for ${guild.name} (${guild.id})`);
  }
}

module.exports = { handleNewGuild };
