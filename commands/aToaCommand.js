const { Command } = require('discord-akairo');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const axios = require('axios');

class AToaCommand extends Command {
  constructor() {
    super('atoa', {
      aliases: ['atoa'],
      args: [
        {
          id: 'user',
          type: 'user',
        },
      ]
    });

    this.languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
        apikey: process.env.TRANSLATOR_APIKEY,
      }),
      serviceUrl: process.env.TRANSLATOR_SERVICE_URL,
    });
  }

  async find() {
    const result = await axios.get(process.env.BORED_API_URL).then(res => res.data);
    return result.activity;
  }

  async translate(text) {
    const result = await this.languageTranslator
      .translate({
        text,
        source: 'en',
        target: 'pt'
      }).then(res => res.result.translations);

    if (result.length === 0) {
      throw new Error();
    }

    return result[0].translation;
  }

  async exec(event, args) {
    const m = 'Just a test';

    const aguarde = await event.channel.send('Consultando os deuses do tédio...');

    try {
      const activity = await this.find();
      const translated = await this.translate(activity);

      if (translated) {
        const msg = `Náo fique à toa! ${translated}`;
        if (args.user) {
          event.channel.send(`<@${args.user.id}> ${msg}`);
        } else {
          event.reply(msg);
        }
      }
    } catch (e) {
      event.channel.send('Todos os deuses estão ocupados no momento!');
    }

    aguarde.delete();

    return true;
  }
}

module.exports = AToaCommand;
