const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

class TranslatorService {
  constructor() {
    this.languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
        apikey: process.env.TRANSLATOR_APIKEY,
      }),
      serviceUrl: process.env.TRANSLATOR_SERVICE_URL,
    });
  }

  async translate(text) {
    const options = { text, source: 'en', target: 'pt' };
    const result = await this.languageTranslator
      .translate(options)
      .then(res => res.result.translations);

    if (result.length === 0) {
      throw new Error();
    }

    return result[0].translation;
  }
}

module.exports = TranslatorService;
