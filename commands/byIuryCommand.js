const { Command } = require('discord-akairo');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { Readable } = require('stream');
const { MessageAttachment } = require('discord.js');
const voices = require('../langs.json');

class ByIuryCommand extends Command {
  constructor() {
    super('byIury', {
      aliases: ['byIury', 'byIuri', 'byYuri', 'biIury', 'biIuri', 'biYuri'],
      separator: ' ',
      args: [
        {
          id: 'toFile',
          match: 'flag',
          flag: '-f',
        },
        {
          id: 'lang',
          match: 'option',
          flag: '-l',
          default: '21',
        },
        {
          id: 'text',
          type: 'rest',
        },
      ]
    });

    this.quitInterval = null;
    this.connection = null;
    this.queue = [];

    this.textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({ apikey: process.env.WATSON_APIKEY }),
      serviceUrl: process.env.WATSON_SERVICE_URL,
    });
  }

  getLanguage(langIndex) {
    let result = 'pt-BR_IsabelaV3Voice';
    if (!isNaN(langIndex)) {
      const lang = voices[parseInt(langIndex, 10) - 1];
      if (lang) {
        result = lang.name;
      }
    }
    return result;
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

  async exec(event, args) {
    const aguarde = await event.channel.send('Consultando o Iury, aguarde...');

    const synth = await this.textToSpeech.synthesize({
      text: args.text,
      accept: 'audio/wav',
      voice: this.getLanguage(args.lang)
    });

    const buff = [];

    synth.result.on('data', chunk => buff.push(chunk));
    synth.result.on('end', async () => {
      const file = Buffer.concat(buff);
      const read = Readable.from(file);

      if (event.member.voice.channel) {
        if (!this.connection) {
          this.connection = await event.member.voice.channel.join();
        }
        this.play(read);
      } else {
        args.toFile = true;
      }

      aguarde.delete();

      if (args.toFile) {
        const attachment = new MessageAttachment(file, `${args.text}.wav`);
        event.channel.send(attachment);
      }
    });

    return true;
  }
}

module.exports = ByIuryCommand;
