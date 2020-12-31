const { Readable } = require('stream');

class VoiceService {
  constructor() {
    this.quitInterval = null;
    this.connection = null;
    this.queue = [];
  }

  quit() {
    if (this.connection) {
      if (this.connection.speaking.bitfield) {
        this.quitInterval = setTimeout(this.quit, 10000);
      } else {
        this.connection.disconnect();
        this.connection = null;
        this.quitInterval = null;
      }
    }
  }

  play(readable) {
    if (this.quitInterval) {
      clearInterval(this.quitInterval);
      this.quitInterval = null;
    }
    if (this.connection.speaking.bitfield) {
      this.queue.push(readable);
    } else {
      this.connection
        .play(readable)
        .once('finish', () => {
          if (this.queue.length) {
            this.play(this.queue.shift());
          } else {
            this.quitInterval = setTimeout(() => this.quit(), 10000);
          }
        });
    }
  };

  async stream(event, file) {
    let result = false;
    if (event.member.voice.channel) {
      if (!this.connection) {
        this.connection = await event.member.voice.channel.join();
      }
      this.play(Readable.from(file));
      result = true;
    }
    return result;
  }
}

module.exports = VoiceService;
