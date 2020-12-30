const { Command } = require('discord-akairo');

class CleanCommand extends Command {
  constructor() {
    super('clean', {
      aliases: ['clean']
    });
  }

  async exec(event) {
    const messages = await event.channel.messages.fetch();
    messages.forEach(it => {
      if (it.author.id === this.client.user.id && it.deletable) {
        it.delete();
      }
    });
    return true;
  }
}

module.exports = CleanCommand;
