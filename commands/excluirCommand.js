const { Command } = require('discord-akairo');

class ExcluirCommand extends Command {
  constructor() {
    super('excluir', {
      aliases: ['excluir'],
      args: [
        {
          id: 'command',
          type: 'string',
        },
      ]
    });
  }

  async exec(event, args) {
    let message = 'comando inválido!';

    if (args.command) {
      if (this.client.databaseService.commands.indexOf(args.command.toLowerCase()) !== -1) {
        const command = await this.client.databaseService.models.command.findOne({
          where: { 
            command: args.command.toLowerCase()
          }
        });

        if (command) {
          if (command.createdBy === event.author.id) {
            await this.client.databaseService.models.command.destroy({ where: { id: command.id } });
            await this.client.databaseService.loadCommands();

            message = 'comando excluido com sucesso!';
          } else {
            message = `este comando foi criado por <@${command.createdBy}>, somente ele pode excluí-lo!`;
          }
        } else {
          message = `comando \`\`${args.command}\`\` não encontrado!`;
        }
      } else {
        message = `comando \`\`${args.command}\`\` não encontrado!`;
      }
    }

    event.reply(message);
  }
}

module.exports = ExcluirCommand;
