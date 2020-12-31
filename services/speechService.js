const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const voices = require('../langs.json');

class SpeechService {
  constructor() {
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

  getVoices() {
    return voices;
  }

  convert(voiceIndex, text) {
    const voice = this.getLanguage(voiceIndex);
    const options = { text, accept: 'audio/wav', voice };
    
    return new Promise(resolve => {
      this.textToSpeech
        .synthesize(options)
        .then(synth => {
          const buff = [];
          synth.result.on('data', chunk => buff.push(chunk));
          synth.result.on('end', () => resolve(Buffer.concat(buff)));
        });
    });
  }
}

module.exports = SpeechService;
