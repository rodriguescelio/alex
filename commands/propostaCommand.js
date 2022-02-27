const Jimp = require('jimp');

const TEMPLATE = 'https://cdn.discordapp.com/attachments/712761331245383683/864929563561426954/template.png';

class PropostaCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.proposta;
    this.command = this.i18n.command;
    this.args = [
      { name: 'text', alias: 't', type: String }
    ];
  }

  async exec(event, args) {
    let file = process.env.PROPOSTA_DEFAULT;
    if (args._unknown.length === 2 && args._unknown.every(it => /<@!\d+>/.test(it))) {
      const userFrom = await this.client.users.fetch(args._unknown[0].replace(/\D/g, ''));
      const userTo = await this.client.users.fetch(args._unknown[1].replace(/\D/g, ''));

      const template = await Jimp.read(TEMPLATE);
      const from = await Jimp.read(userFrom.displayAvatarURL({ size: 64, format: 'png' }));
      const to = await Jimp.read(userTo.displayAvatarURL({ size: 64, format: 'png' }));
      const font = await Jimp.loadFont(Jimp.FONT_SANS_14_BLACK);

      const text = `${userTo.username}. ${args.text || this.i18n.message}`;

      const image = await template
        .composite(from, 185, 12)
        .composite(to, 365, 50)
        .print(font, 30, 70, text, 120)
        .getBufferAsync(Jimp.MIME_PNG);

      file = { attachment: image, name: 'proposta.png' };
    }
    event.channel.send({ files: [file] });
  }
}

module.exports = PropostaCommand;
