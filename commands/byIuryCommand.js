const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');

class ByIuryCommand extends Command {
  constructor() {
    super('byIury', {
      aliases: ['byIury', 'byIuri', 'byYuri', 'biIury', 'biIuri', 'biYuri'],
      separator: ' ',
      args: [
        {
          id: 'toFile',
          match: 'flag',
          flag: '-f',
        },
        {
          id: 'lang',
          match: 'option',
          flag: '-l',
          default: '21',
        },
        {
          id: 'text',
          type: 'rest',
        },
      ]
    });
  }

  async exec(event, args) {
    const aguarde = await event.channel.send('Consultando o Iury, aguarde...');

    const file = await this.client.speechService.convert(args.lang, args.text);
    const play = await this.client.voiceService.stream(event, file);

    if (!play) {
      args.toFile = true;
    }

    aguarde.delete();

    if (args.toFile) {
      const attachment = new MessageAttachment(file, `${args.text}.wav`);
      event.channel.send(attachment);
    }

    return true;
  }
}

module.exports = ByIuryCommand;
