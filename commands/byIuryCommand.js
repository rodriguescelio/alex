class ByIuryCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.byIury;
    this.command = this.i18n.command;
    this.args = [
      { name: 'toFile', alias: 'f', type: Boolean },
      { name: 'lang', alias: 'l', type: Number },
    ];
  }

  async exec(event, args) {
    const aguarde = await event.channel.send(this.i18n.loading);

    const file = await this.client.speechService.convert(args.lang || 21, args._unknown.join(' '));
    const play = await this.client.voiceService.stream(event, file);

    if (!play) {
      args.toFile = true;
    }

    aguarde.delete();

    if (args.toFile) {
      event.channel.send({
        files: [
          {
            attachment: file,
            name: `${args._unknown.join('_')}.wav`,
          }
        ]
      });
    }
  }
}

module.exports = ByIuryCommand;
