const { Command } = require('discord-akairo');

class RegistrarCommand extends Command {
  constructor() {
    super('registrar', {
      aliases: ['registrar'],
      args: [
        {
          id: 'command',
          match: 'option',
          flag: ['-c ', '-command'],
        },
        {
          id: 'text',
          match: 'option',
          flag: ['-t', '-text'],
        },
        {
          id: 'image',
          match: 'option',
          flag: ['-i', '-image'],
        },
        {
          id: 'video',
          match: 'option',
          flag: ['-v', '-video'],
        },
        {
          id: 'audio',
          match: 'option',
          flag: ['-a', '-audio'],
        },
        {
          id: 'playAudio',
          match: 'flag',
          flag: ['-p', '-play'],
        },
      ]
    });
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
