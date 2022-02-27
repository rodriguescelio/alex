class RegistrarCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.registrar;
    this.command = this.i18n.command;
    this.args = [
      { name: 'command', alias: 'c', type: String },
      { name: 'text', alias: 't', type: String },
      { name: 'audio', alias: 'a', type: String },
      { name: 'image', alias: 'i', type: String },
      { name: 'video', alias: 'v', type: String },
      { name: 'playAudio', alias: 'p', type: Boolean },
    ];
  }

  async exec(event, args) {
    let message = this.i18n.invalid;
    if (Object.values(args).filter(it => !!it).length > 1) {
      if (this.client.databaseService.commands.indexOf(args.command.toLowerCase()) === -1) {
        try {
          await this.client.databaseService.models.command.create({
            ...args,
            command: args.command.toLowerCase(),
            createdBy: event.author.id,
          });

          await this.client.databaseService.loadCommands();

          message = this.i18n.success.replace('{{C}}', args.command);
        } catch (e) {
          message = this.i18n.error;
        }
      } else {
        message = this.i18n.exists.replace('{{C}}', args.command);
      }
    }
    event.reply(message);
  }
}

module.exports = RegistrarCommand;
