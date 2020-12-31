const { Command } = require('discord-akairo');
const axios = require('axios');

class OfenderCommand extends Command {
  constructor() {
    super('ofender', {
      aliases: ['ofender', 'xingar'],
      args: [
        {
          id: 'user',
          type: 'user',
        },
      ]
    });
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

      if (args.user) {
        event.channel.send(`<@${args.user.id}> ${translated}`);
      } else {
        event.reply(translated);
      }

    } catch (e) {
      event.channel.send('Todos os deuses estão ocupados no momento!');
    }

    aguarde.delete();

    return true;
  }
}

module.exports = OfenderCommand;
