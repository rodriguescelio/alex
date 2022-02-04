const axios = require('axios');

class DatabaseCommand {
  constructor(client) {
    this.client = client;
    this.conditional = true;
  }

  async exec(event, _, commandStr) {
    const command = await this.client.databaseService.models.command.findOne({
      where: { 
        command: commandStr.toLowerCase()
      }
    });

    if (command) {
      if (command.text) {
        await event.channel.send(command.text);
      }

      if (command.image) {
        await event.channel.send(command.image);
      }

      if (command.video) {
        await event.channel.send(command.video);
      }

      if (command.audio) {
        if (command.playAudio) {
          const audio = await axios.get(command.audio, { responseType: 'arraybuffer' }).then(res => res.data);
          await this.client.voiceService.stream(event, audio);
        } else {
          await event.channel.send(command.audio);
        }
      }
    }
  }
}

module.exports = DatabaseCommand;
