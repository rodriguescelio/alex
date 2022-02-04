const axios = require('axios');

class AToaCommand {
  constructor(client) {
    this.client = client;
    this.command = 'atoa';
    this.args = [
      { name: 'user', defaultOption: true }
    ];
  }

  async find() {
    const result = await axios.get(process.env.BORED_API_URL).then(res => res.data);
    return result.activity;
  }

  async exec(event, args) {
    const aguarde = await event.channel.send('Consultando os deuses do tédio...');

    try {
      const activity = await this.find();
      const translated = await this.client.translatorService.translate(activity);

      if (translated) {
        const msg = `Náo fique à toa! ${translated}`;
        if (args.user && /<@!\d+>/.test(args.user)) {
          event.channel.send(`${args.user} ${msg}`);
        } else {
          event.reply(msg);
        }
      }
    } catch (e) {
      event.channel.send('Todos os deuses estão ocupados no momento!');
    }

    aguarde.delete();
  }
}

module.exports = AToaCommand;
