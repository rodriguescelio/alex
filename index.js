require('dotenv').config();

const Alex = require('./alex');

const client = new Alex();
client.login(process.env.DISCORD_TOKEN);
