const { MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios');

class AudiosCommand {

  constructor(client) {
    this.client = client;
    this.command = 'audios';
  }

  async onInteraction(interaction) {
    if (interaction.isButton() && interaction.customId.indexOf('audiosCommand') === 0) {
      const command = await this.client.databaseService.models.command.findOne({
        where: { 
          command: interaction.customId.replace('audiosCommand-', ''),
        },
      });

      const audio = await axios.get(command.audio, { responseType: 'arraybuffer' }).then(res => res.data);
      await this.client.voiceService.stream(interaction, audio);

      await interaction.deferUpdate();
    }
  }

  async exec(event) {
    const commands = await this.client.databaseService.models.command.findAll({
      where: { 
        playAudio: true
      },
      order: [
        ['command']
      ],
    });

    const rows = [];

    for (let i = 0; i < Math.ceil(commands.length / 5); i++) {
      const arr = Array.from(Array(5), (_, k) => commands[k + (5 * i)]);
      const row = new MessageActionRow();

      arr.filter(it => !!it).forEach(it => {
        row.addComponents(
          new MessageButton()
            .setCustomId(`audiosCommand-${it.command}`)
            .setLabel(it.command)
            .setStyle('PRIMARY')
        );
      });

      rows.push(row);
    }

    for (let i = 0; i < Math.ceil(rows.length / 5); i++) {
      const arr = Array.from(Array(5), (_, k) => rows[k + (5 * i)]);
      event.channel.send({
        content: i == 0 ? 'Clique para reproduzir.' : Array.from(Array(100), (_, k) => '-').join(''),
        components: arr.filter(it => !!it)
      });
    }
  }

}

module.exports = AudiosCommand;
