const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const DatabaseService = require('./services/databaseService');
const SpeechService = require('./services/speechService');
const TranslatorService = require('./services/translatorService');
const VoiceService = require('./services/voiceService');

class Alex extends AkairoClient {
  constructor() {
    super();
    this.commandHandler = new CommandHandler(this, { directory: './commands', prefix: '!', commandUtil: true });
    this.listenerHandler = new ListenerHandler(this, { directory: './listeners' });

    this.speechService = new SpeechService();
    this.translatorService = new TranslatorService();
    this.voiceService = new VoiceService();
    this.databaseService = new DatabaseService();

    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}

module.exports = Alex;
