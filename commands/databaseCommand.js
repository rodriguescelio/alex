const axios = require('axios');
const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');

class DatabaseCommand extends Command {
  constructor() {
    super('database', {
      category: 'random'
    });
  }

  condition(message) {
    let result = false;
    if (!!message.util.parsed.prefix && message.util.parsed.prefix === '!') {
      result = this.client.databaseService.commands.indexOf(message.util.parsed.alias.toLowerCase()) !== -1;
    }
    return result;
  }

  async exec(event) {
    const command = await this.client.databaseService.models.command.findOne({
      where: { 
        command: event.util.parsed.alias.toLowerCase()
      }
    });

    if (command) {
      if (command.text) {
        await event.channel.send(command.text);
      }

      if (command.image) {
        await event.channel.send(new MessageAttachment(command.image));
      }

      if (command.video) {
        await event.channel.send(command.video);
      }

      if (command.audio) {
        if (command.playAudio) {
          const audio = await axios.get(command.audio, { responseType: 'arraybuffer' }).then(res => res.data);
          await this.client.voiceService.stream(event, audio);
        } else {
          await event.channel.send(new MessageAttachment(command.audio));
        }
      }
    }
  }
}

module.exports = DatabaseCommand;
