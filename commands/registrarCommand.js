class RegistrarCommand {
  constructor(client) {
    this.client = client;
    this.command = 'registrar';
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
    let message = 'comando inválido!';
    if (Object.values(args).filter(it => !!it).length > 1) {
      if (this.client.databaseService.commands.indexOf(args.command.toLowerCase()) === -1) {
        try {
          await this.client.databaseService.models.command.create({
            ...args,
            command: args.command.toLowerCase(),
            createdBy: event.author.id,
          });

          await this.client.databaseService.loadCommands();

          message = `comando criado com sucesso! Para executa-lo digite \`\`!${args.command}\`\`.`;
        } catch (e) {
          message = `não foi possível criar o comando!`;
        }
      } else {
        message = `o comando \`\`!${args.command}\`\` já existe!`;
      }
    }
    event.reply(message);
  }
}

module.exports = RegistrarCommand;