require('dotenv').config();

const { join } = require('path');
const Alex = require('./alex');

const alex = new Alex({
  prefix: '!',
  commands: join(__dirname, 'commands'),
});

alex.login(process.env.DISCORD_TOKEN);
