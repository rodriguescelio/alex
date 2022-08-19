class ExcluirCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.excluir;
    this.command = this.i18n.command;
    this.args = [
      { name: 'command', type: String, defaultOption: true }
    ];
  }

  async exec(event, args) {
    let message = this.i18n.invalid;

    if (args.command) {
      if (this.client.databaseService.commands.indexOf(args.command.toLowerCase()) !== -1) {
        const command = await this.client.databaseService.models.command.findOne({
          where: { 
            command: args.command.toLowerCase()
          }
        });

        if (command) {
          await this.client.databaseService.models.command.destroy({ where: { id: command.id } });
          await this.client.databaseService.loadCommands();
          message = this.i18n.success;
        } else {
          message = this.i18n.notFound.replace('{{C}}', args.command);
        }
      } else {
        message = this.i18n.notFound.replace('{{C}}', args.command);
      }
    }

    event.reply(message);
  }
}

module.exports = ExcluirCommand;
