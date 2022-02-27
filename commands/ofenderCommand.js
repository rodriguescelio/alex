const axios = require('axios');

class OfenderCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.ofender;
    this.command = this.i18n.command;
    this.args = [
      { name: 'user', defaultOption: true }
    ];
  }

  async find() {
    const result = await axios.get(process.env.EVIL_INSULT_URL).then(res => res.data);
    return result.insult;
  }

  async exec(event, args) {
    const aguarde = await event.channel.send(this.i18n.loading);
    try {
      const insult = await this.find();
      const translated = await this.client.translatorService.translate(insult);
      if (args.user && /<@!\d+>/.test(args.user)) {
        event.channel.send(`${args.user} ${translated}`);
      } else {
        event.reply(translated);
      }
    } catch (e) {
      event.channel.send(this.i18n.error);
    }
    aguarde.delete();
  }
}

module.exports = OfenderCommand;
