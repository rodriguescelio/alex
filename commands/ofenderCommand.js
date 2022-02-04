const axios = require('axios');

class OfenderCommand {
  constructor(client) {
    this.client = client;
    this.command = 'ofender';
    this.args = [
      { name: 'user', defaultOption: true }
    ];
  }

  async find() {
    const result = await axios.get(process.env.EVIL_INSULT_URL).then(res => res.data);
    return result.insult;
  }

  async exec(event, args) {
    const aguarde = await event.channel.send('Consultando os deuses do ódio...');
    try {
      const insult = await this.find();
      const translated = await this.client.translatorService.translate(insult);
      if (args.user && /<@!\d+>/.test(args.user)) {
        event.channel.send(`${args.user} ${translated}`);
      } else {
        event.reply(translated);
      }
    } catch (e) {
      event.channel.send('Todos os deuses estão ocupados no momento!');
    }
    aguarde.delete();
  }
}

module.exports = OfenderCommand;
