const { Command } = require('discord-akairo');
const axios = require('axios');

class AToaCommand extends Command {
  constructor() {
    super('atoa', {
      aliases: ['atoa'],
      args: [
        {
          id: 'user',
          type: 'user',
        },
      ]
    });
  }

  async find() {
    const result = await axios.get(process.env.BORED_API_URL).then(res => res.data);
    return result.activity;
  }

  async exec(event, args) {
    const m = 'Just a test';

    const aguarde = await event.channel.send('Consultando os deuses do tédio...');

    try {
      const activity = await this.find();
      const translated = await this.client.translatorService.translate(activity);

      if (translated) {
        const msg = `Náo fique à toa! ${translated}`;
        if (args.user) {
          event.channel.send(`<@${args.user.id}> ${msg}`);
        } else {
          event.reply(msg);
        }
      }
    } catch (e) {
      event.channel.send('Todos os deuses estão ocupados no momento!');
    }

    aguarde.delete();

    return true;
  }
}

module.exports = AToaCommand;
