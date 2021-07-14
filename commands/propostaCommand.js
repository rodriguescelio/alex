const { Command } = require('discord-akairo');
const axios = require('axios');
const { MessageAttachment, File } = require('discord.js');
const Jimp = require('jimp');

const TEMPLATE = 'https://cdn.discordapp.com/attachments/712761331245383683/864929563561426954/template.png';
const MESSAGE = "Queremos voce aqui!!";

class PropostaCommand extends Command {
  constructor() {
    super('proposta', {
      aliases: ['proposta'],
      args: [
        {
          id: 'from',
          type: 'user',
        },
    		{
		      id: 'to',
          type: 'user',
        },
        {
          id: 'text',
          match: 'option',
          flag: ['-t', '-text'],
        },
      ]
    });
  }

  async exec(event, args) {
	let attachment = new MessageAttachment(process.env.PROPOSTA_DEFAULT);

	if (args.from && args.to) {
	  const template = await Jimp.read(TEMPLATE);
	  const from = await Jimp.read(args.from.displayAvatarURL({ size: 64, format: 'png' }));
	  const to = await Jimp.read(args.to.displayAvatarURL({ size: 64, format: 'png' }));
	  const font = await Jimp.loadFont(Jimp.FONT_SANS_14_BLACK);

	  const text = `${args.to.username}. ${args.text || MESSAGE}`;

	  const image = await template
		.composite(from, 185, 12)
		.composite(to, 365, 50)
		.print(font, 30, 70, text, 120)
		.getBufferAsync(Jimp.MIME_PNG);

	  attachment = new MessageAttachment(image);
	}
	event.channel.send(attachment);
  }
}

module.exports = PropostaCommand;
