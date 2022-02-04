const { Readable } = require('stream');
const {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

class VoiceService {
  constructor() {
    this.quitInterval = null;
    this.connection = null;
    this.queue = [];
  }

  quit() {
    if (this.connection) {
      if (this.connection.state.networking.state.connectionData.speaking) {
        this.quitInterval = setTimeout(this.quit, 5000);
      } else {
        this.connection.destroy();
        this.connection = null;
        this.quitInterval = null;
      }
    }
  }

  play(file) {
    if (this.quitInterval) {
      clearInterval(this.quitInterval);
      this.quitInterval = null;
    }

    if (this.connection.state.networking.state.connectionData.speaking) {
      this.queue.push(file);
    } else {
      const audioPlayer = createAudioPlayer();
      this.connection.subscribe(audioPlayer);

      audioPlayer.on(AudioPlayerStatus.Idle, () => {
        if (this.queue.length) {
          this.play(this.queue.shift());
        } else {
          this.quitInterval = setTimeout(() => this.quit(), 5000);
        }
      });

      audioPlayer.play(createAudioResource(Readable.from(file)));
    }
  };

  async stream(event, file) {
    let result = false;
    if (event.member.voice.channel) {
      if (this.connection) {
        this.play(file);
      } else {
        const channel = event.member.voice.channel;

        this.connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        this.connection.on(VoiceConnectionStatus.Ready, () => this.play(file));
      }
      result = true;
    }
    return result;
  }
}

module.exports = VoiceService;
