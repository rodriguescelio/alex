const axios = require('axios');

class AToaCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.aToa;
    this.command = this.i18n.command;
    this.args = [
      { name: 'user', defaultOption: true }
    ];
  }

  async find() {
    const result = await axios.get(process.env.BORED_API_URL).then(res => res.data);
    return result.activity;
  }

  async exec(event, args) {
    const aguarde = await event.channel.send(this.i18n.loading);

    try {
      const activity = await this.find();
      const translated = await this.client.translatorService.translate(activity);

      if (translated) {
        const msg = `${this.i18n.result} ${translated}`;
        if (args.user && /<@!\d+>/.test(args.user)) {
          event.channel.send(`${args.user} ${msg}`);
        } else {
          event.reply(msg);
        }
      }
    } catch (e) {
      event.channel.send(this.i18n.error);
    }

    aguarde.delete();
  }
}

module.exports = AToaCommand;
